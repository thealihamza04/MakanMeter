import re
from typing import Dict, List, Optional, Tuple
import numpy as np
import pandas as pd

from app.model_loader import artifacts, get_feature_order
from app.schemas import (
    PropertyFeaturesInput,
    PredictionResponse,
    BatchPredictionResponse,
)


def _get_location_index() -> Tuple[Dict[str, str], float, float]:
    """Builds a case-insensitive lookup map for recognized locations along with medians."""
    loc_freq: Optional[pd.Series] = artifacts.get("location_freq")
    loc_target: Optional[pd.Series] = artifacts.get("location_target_mean")

    default_freq = float(loc_freq.median()) if loc_freq is not None and not loc_freq.empty else 0.00018
    default_target = float(loc_target.median()) if loc_target is not None and not loc_target.empty else 17.65

    lookup: Dict[str, str] = {}
    if loc_freq is not None and hasattr(loc_freq, "index"):
        for loc in loc_freq.index:
            lookup[str(loc).strip().lower()] = str(loc)

    return lookup, default_freq, default_target


def resolve_location(raw_location: str) -> Tuple[float, float, Optional[str], bool]:
    """Matches a location string against trained artifacts to retrieve frequency and target encodings."""
    if not raw_location or not raw_location.strip():
        _, def_freq, def_target = _get_location_index()
        return def_freq, def_target, None, False

    lookup, default_freq, default_target = _get_location_index()
    loc_freq: Optional[pd.Series] = artifacts.get("location_freq")
    loc_target: Optional[pd.Series] = artifacts.get("location_target_mean")

    cleaned = raw_location.strip().lower()

    # 1. Exact match (case-insensitive)
    matched_key = lookup.get(cleaned)

    # 2. Substring match if not exact
    if not matched_key:
        for loc_lower, orig_name in lookup.items():
            if cleaned in loc_lower or loc_lower in cleaned:
                matched_key = orig_name
                break

    if matched_key and loc_freq is not None and loc_target is not None:
        freq_val = float(loc_freq.get(matched_key, default_freq))
        target_val = float(loc_target.get(matched_key, default_target))
        return freq_val, target_val, matched_key, True

    return default_freq, default_target, None, False


def _normalize_amenity_name(name: str) -> str:
    """Normalizes amenity string for flexible matching."""
    return re.sub(r"[^a-z0-9]", "", name.lower())


def _resolve_area_marla(payload: PropertyFeaturesInput) -> float:
    """Converts input area to Marla based on unit."""
    if payload.area_marla is not None:
        return float(payload.area_marla)

    if payload.area is not None:
        unit = (payload.area_unit or "marla").strip().lower()
        if "kanal" in unit:
            return float(payload.area) * 20.0
        elif "sq" in unit or "feet" in unit or "foot" in unit:
            # 1 Marla in standard Punjab/Zameen housing is approx 225 sq ft
            return float(payload.area) / 225.0
        return float(payload.area)

    return np.nan


def _resolve_furnished_encoded(val: Optional[object]) -> float:
    """Converts furnishing input to 1.0 (Furnished) or 0.0 (Unfurnished)."""
    if val is None:
        return np.nan
    if isinstance(val, bool):
        return 1.0 if val else 0.0
    if isinstance(val, (int, float)):
        return 1.0 if val > 0 else 0.0
    if isinstance(val, str):
        v = val.strip().lower()
        if "unfurnish" in v or "no" in v:
            return 0.0
        if "furnish" in v or "yes" in v or "semi" in v:
            return 1.0
    return 0.0


def _resolve_type_house(type_val: Optional[str]) -> float:
    """Converts property type to 1.0 (House) or 0.0 (Flat/Apartment/Other)."""
    if not type_val:
        return 1.0
    t = str(type_val).strip().lower()
    if "house" in t or "villa" in t or "cottage" in t:
        return 1.0
    if "flat" in t or "apartment" in t or "penthouse" in t or "upper" in t or "lower" in t:
        return 0.0
    return 1.0


def transform_payload_to_feature_dict(
    payload: PropertyFeaturesInput,
) -> Tuple[Dict[str, float], Optional[str], bool]:
    """Encodes all categorical, location, and amenity parameters into the model's feature space."""
    # Location encoding
    freq_enc, target_enc, matched_loc, loc_found = resolve_location(payload.location)

    # Area
    area_marla = _resolve_area_marla(payload)

    # Bedrooms
    bedrooms = float(payload.bedrooms) if payload.bedrooms is not None else np.nan

    # Furnished & Type
    furnished_enc = _resolve_furnished_encoded(payload.furnished)
    type_house = _resolve_type_house(payload.type or payload.property_type)

    # Property age
    property_age = float(payload.property_age) if payload.property_age is not None else np.nan

    # Process amenities list if provided
    amenities_set = set()
    if payload.amenities:
        for a in payload.amenities:
            if isinstance(a, str):
                amenities_set.add(_normalize_amenity_name(a))

    def get_amenity_val(
        field_val: Optional[object],
        keywords: List[str],
        default_when_missing: Optional[float] = None,
    ) -> float:
        # Explicit field takes priority
        if field_val is not None:
            if isinstance(field_val, bool):
                return 1.0 if field_val else 0.0
            return float(field_val)

        # If amenities list was supplied, check presence
        if payload.amenities is not None:
            for kw in keywords:
                norm_kw = _normalize_amenity_name(kw)
                if any(norm_kw in item or item in norm_kw for item in amenities_set):
                    return 1.0
            return default_when_missing if default_when_missing is not None else 0.0

        # If neither explicit field nor amenities list, use default or nan (for imputer)
        return np.nan if default_when_missing is None else default_when_missing

    kitchens = get_amenity_val(payload.kitchens, ["kitchen", "kitchens"], default_when_missing=np.nan)
    store_rooms = get_amenity_val(payload.store_rooms, ["store", "storeroom", "storerooms"])
    servant_quarters = get_amenity_val(payload.servant_quarters, ["servant", "servantquarter", "servantquarters"])
    gym = get_amenity_val(payload.gym, ["gym", "fitness"])
    study_room = get_amenity_val(payload.study_room, ["study", "studyroom"])
    drawing_room = get_amenity_val(payload.drawing_room, ["drawing", "drawingroom"])
    dining_room = get_amenity_val(payload.dining_room, ["dining", "diningroom"])
    lawn_garden = get_amenity_val(payload.lawn_garden, ["lawn", "garden", "lawngarden"])
    swimming_pool = get_amenity_val(payload.swimming_pool, ["pool", "swimmingpool"])
    electricity_backup = get_amenity_val(payload.electricity_backup, ["electricity", "backup", "generator", "ups"])
    lounge_sitting = get_amenity_val(payload.lounge_sitting_room, ["lounge", "sittingroom", "livingroom"])

    features_dict: Dict[str, float] = {
        "Kitchens": kitchens,
        "Store Rooms": store_rooms,
        "Servant Quarters": servant_quarters,
        "Gym": gym,
        "Study Room": study_room,
        "Drawing Room": drawing_room,
        "Dining Room": dining_room,
        "Lawn/Garden": lawn_garden,
        "Swimming Pool": swimming_pool,
        "Electricity Backup": electricity_backup,
        "Lounge/Sitting Room": lounge_sitting,
        "Area_Marla": area_marla,
        "Bedrooms_Numeric": bedrooms,
        "Furnished_Encoded": furnished_enc,
        "Type_House": type_house,
        "Location_Frequency_Encoded": freq_enc,
        "Location_Target_Encoded": target_enc,
        "Property_Age": property_age,
    }

    return features_dict, matched_loc, loc_found


def _format_price_pkr(price_millions: float) -> str:
    """Formats price into Million and Crore PKR representation."""
    crores = price_millions / 10.0
    if price_millions >= 10.0:
        return f"{price_millions:.2f} Million PKR ({crores:.2f} Crore PKR)"
    else:
        lakhs = price_millions * 10.0
        return f"{price_millions:.2f} Million PKR ({lakhs:.2f} Lakh PKR)"


def predict_single(payload: PropertyFeaturesInput) -> PredictionResponse:
    """Executes single property price prediction through the preprocessing and model pipeline."""
    model = artifacts.get("model")
    imputer = artifacts.get("imputer")

    if model is None:
        raise RuntimeError("Model is not loaded in memory. Ensure load_artifacts() was called on startup.")

    feature_order = get_feature_order()
    feature_dict, matched_loc, loc_found = transform_payload_to_feature_dict(payload)

    # Ensure SimpleImputer has cross-version patch if needed
    if imputer is not None and not hasattr(imputer, "_fill_dtype") and hasattr(imputer, "_fit_dtype"):
        imputer._fill_dtype = imputer._fit_dtype

    # Create dataframe with canonical column order
    df = pd.DataFrame([feature_dict], columns=feature_order)

    # Impute missing values if imputer is available
    if imputer is not None:
        imputed_array = imputer.transform(df)
        prepared_df = pd.DataFrame(imputed_array, columns=feature_order)
    else:
        prepared_df = df.fillna(0.0)

    # Predict
    pred = model.predict(prepared_df)
    predicted_millions = float(round(pred[0], 2))
    predicted_full_pkr = float(round(predicted_millions * 1_000_000.0, 2))

    # Clean feature dict with imputed values for response transparency
    clean_feature_values = {
        col: float(round(prepared_df.iloc[0][col], 4)) for col in feature_order
    }

    return PredictionResponse(
        success=True,
        predicted_price_millions_pkr=predicted_millions,
        predicted_price_pkr=predicted_full_pkr,
        price_formatted=_format_price_pkr(predicted_millions),
        currency="PKR",
        unit="Millions",
        matched_location=matched_loc,
        location_found=loc_found,
        feature_values=clean_feature_values,
    )


def predict_batch(properties: List[PropertyFeaturesInput]) -> BatchPredictionResponse:
    """Executes prediction on a batch of property inputs."""
    predictions = [predict_single(p) for p in properties]
    return BatchPredictionResponse(count=len(predictions), predictions=predictions)
