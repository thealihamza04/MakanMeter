from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field, model_validator


class PropertyFeaturesInput(BaseModel):
    """Input payload accepting property details for price prediction."""

    area: Optional[float] = Field(
        None,
        description="Property size (defaults to unit specified in area_unit, default is Marla).",
        examples=[10.0],
    )
    area_marla: Optional[float] = Field(
        None,
        description="Explicit area in Marla. Overrides area if provided.",
        examples=[10.0],
    )
    area_unit: Optional[str] = Field(
        "Marla",
        description="Unit for area ('Marla', 'Kanal', 'Sqft'). Default is 'Marla'. 1 Kanal = 20 Marlas, 1 Marla ~ 225 Sqft.",
        examples=["Marla"],
    )
    location: str = Field(
        ...,
        description="Location/Society name (e.g., 'DHA Defence', 'Bahria Town', 'Johar Town').",
        examples=["DHA Defence"],
    )
    bedrooms: Optional[float] = Field(
        4.0,
        description="Number of bedrooms (default: 4).",
        examples=[4],
    )
    type: Optional[str] = Field(
        "House",
        description="Property type ('House', 'Flat', 'Apartment', etc.).",
        examples=["House"],
    )
    property_type: Optional[str] = Field(
        None,
        description="Alternative alias for 'type'.",
    )
    furnished: Optional[Union[bool, int, str]] = Field(
        False,
        description="Furnishing status (True/False, 1/0, 'Furnished', or 'Unfurnished').",
        examples=[False],
    )
    property_age: Optional[float] = Field(
        1.0,
        description="Estimated age of property in years (default: 1.0).",
        examples=[1.0],
    )
    amenities: Optional[List[str]] = Field(
        default=None,
        description="List of available amenities (e.g. ['Gym', 'Swimming Pool', 'Lawn/Garden', 'Electricity Backup']).",
        examples=[["Gym", "Lawn/Garden", "Electricity Backup"]],
    )

    # Granular individual amenities (override or supplement list)
    kitchens: Optional[int] = Field(None, description="Number of kitchens (default median: 2)")
    store_rooms: Optional[int] = Field(None, description="Number of store rooms")
    servant_quarters: Optional[int] = Field(None, description="Number of servant quarters")
    gym: Optional[Union[int, bool]] = Field(None, description="Gym available (1/0 or bool)")
    study_room: Optional[Union[int, bool]] = Field(None, description="Study room available (1/0 or bool)")
    drawing_room: Optional[Union[int, bool]] = Field(None, description="Drawing room available (1/0 or bool)")
    dining_room: Optional[Union[int, bool]] = Field(None, description="Dining room available (1/0 or bool)")
    lawn_garden: Optional[Union[int, bool]] = Field(None, description="Lawn / Garden available (1/0 or bool)")
    swimming_pool: Optional[Union[int, bool]] = Field(None, description="Swimming pool available (1/0 or bool)")
    electricity_backup: Optional[Union[int, bool]] = Field(None, description="Electricity backup available (1/0 or bool)")
    lounge_sitting_room: Optional[Union[int, bool]] = Field(None, description="Lounge / sitting room available (1/0 or bool)")

    @model_validator(mode="before")
    @classmethod
    def resolve_aliases(cls, values):
        if isinstance(values, dict):
            if not values.get("type") and values.get("property_type"):
                values["type"] = values.get("property_type")
            if values.get("area_marla") is not None and values.get("area") is None:
                values["area"] = values.get("area_marla")
        return values


class PredictionResponse(BaseModel):
    """Response payload containing model price prediction and encoding details."""

    success: bool = True
    predicted_price_millions_pkr: float = Field(
        ...,
        description="Predicted price in Millions PKR (the original target scale).",
        examples=[45.50],
    )
    predicted_price_pkr: float = Field(
        ...,
        description="Predicted price in full PKR.",
        examples=[45500000.0],
    )
    price_formatted: str = Field(
        ...,
        description="Human-readable formatted price string.",
        examples=["45.50 Million PKR (4.55 Crore)"],
    )
    currency: str = "PKR"
    unit: str = "Millions"
    matched_location: Optional[str] = Field(
        None,
        description="The recognized location key matched against training artifacts.",
    )
    location_found: bool = Field(
        ...,
        description="Whether the location was found in trained frequency/target encoding tables.",
    )
    feature_values: Dict[str, float] = Field(
        ...,
        description="The exact numeric values corresponding to feature_cols fed to the model.",
    )


class BatchPredictionRequest(BaseModel):
    """Batch input payload for multiple property price predictions."""

    properties: List[PropertyFeaturesInput]


class BatchPredictionResponse(BaseModel):
    """Batch response payload."""

    count: int
    predictions: List[PredictionResponse]
