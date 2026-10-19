import json
from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parent
POSSIBLE_PATHS = [
    BASE_DIR.parent.parent / "Models" / "random_forest.joblib",
    BASE_DIR.parent.parent / "model" / "random_forest.joblib",
    BASE_DIR.parent / "Models" / "random_forest.joblib",
    BASE_DIR.parent / "model" / "random_forest.joblib",
    BASE_DIR / "Models" / "random_forest.joblib",
    BASE_DIR / "model" / "random_forest.joblib",
]

# Canonical feature order matching trained model input
FEATURE_ORDER = [
    "Kitchens",
    "Store Rooms",
    "Servant Quarters",
    "Gym",
    "Study Room",
    "Drawing Room",
    "Dining Room",
    "Lawn/Garden",
    "Swimming Pool",
    "Electricity Backup",
    "Lounge/Sitting Room",
    "Area_Marla",
    "Bedrooms_Numeric",
    "Furnished_Encoded",
    "Type_House",
    "Location_Frequency_Encoded",
    "Location_Target_Encoded",
    "Property_Age",
]

# In-memory storage for loaded model and preprocessing artifacts
artifacts: dict = {}
evaluation_metadata: dict = {}


def load_artifacts() -> dict:
    """Loads the model, preprocessing artifacts, and evaluation metrics into memory."""
    model_path = next((p for p in POSSIBLE_PATHS if p.exists()), None)
    if not model_path:
        raise FileNotFoundError(
            f"Model artifact 'random_forest.joblib' not found. Checked: {[str(p) for p in POSSIBLE_PATHS]}"
        )

    print(f"Loading model artifacts from: {model_path}")
    loaded = joblib.load(model_path)
    if isinstance(loaded, dict):
        artifacts.update(loaded)
    else:
        artifacts["model"] = loaded

    # Ensure cross-version compatibility for SimpleImputer if loaded across sklearn versions
    imputer = artifacts.get("imputer")
    if imputer is not None and not hasattr(imputer, "_fill_dtype") and hasattr(imputer, "_fit_dtype"):
        imputer._fill_dtype = imputer._fit_dtype

    # Ensure feature order matches the saved features
    if "features" in artifacts:
        artifacts["feature_order"] = list(artifacts["features"])
    else:
        artifacts["feature_order"] = list(FEATURE_ORDER)

    # Load evaluation metrics from metrics.json
    metrics_path = BASE_DIR / "metrics.json"
    if metrics_path.exists():
        try:
            with open(metrics_path, "r", encoding="utf-8") as f:
                evaluation_metadata.update(json.load(f))
        except Exception as e:
            print(f"Warning: Failed to load metrics.json: {e}")

    print(f"Successfully loaded artifacts: {list(artifacts.keys())}")
    return artifacts


def get_artifacts() -> dict:
    """Returns the loaded artifacts."""
    return artifacts


def get_feature_order() -> list:
    """Returns the strict feature order expected by the model."""
    return artifacts.get("feature_order", list(FEATURE_ORDER))


def get_evaluation_metrics() -> dict:
    """Returns preserved evaluation metrics and computed feature importances."""
    metrics = dict(evaluation_metadata)

    # Add dynamic model feature importances if model is loaded
    model = artifacts.get("model")
    features = get_feature_order()
    if model is not None and hasattr(model, "feature_importances_"):
        importances = {
            feat: round(float(imp), 5)
            for feat, imp in zip(features, model.feature_importances_)
        }
        # Sort descending by importance
        metrics["feature_importances"] = dict(
            sorted(importances.items(), key=lambda item: item[1], reverse=True)
        )

    return metrics


def get_known_locations() -> list:
    """Returns the list of unique locations recognized by the model artifacts."""
    loc_freq = artifacts.get("location_freq")
    if loc_freq is not None and hasattr(loc_freq, "index"):
        return sorted([str(loc) for loc in loc_freq.index])
    return []

