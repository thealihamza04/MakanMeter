from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException

try:
    from app.model_loader import (
        load_artifacts,
        artifacts,
        get_feature_order,
        get_evaluation_metrics,
        get_known_locations,
    )
    from app.schemas import (
        PropertyFeaturesInput,
        PredictionResponse,
        BatchPredictionRequest,
        BatchPredictionResponse,
    )
    from app.predictor import predict_single, predict_batch
except ImportError:
    from model_loader import (
        load_artifacts,
        artifacts,
        get_feature_order,
        get_evaluation_metrics,
        get_known_locations,
    )
    from schemas import (
        PropertyFeaturesInput,
        PredictionResponse,
        BatchPredictionRequest,
        BatchPredictionResponse,
    )
    from predictor import predict_single, predict_batch


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model and preprocessing artifacts on startup
    load_artifacts()
    yield
    artifacts.clear()


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="House Price Prediction API",
    description="REST API for predicting real estate prices in Pakistan using trained Random Forest Regressor.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "House Price Prediction API is running",
        "docs_url": "/docs",
        "endpoints": {
            "predict": "POST /predict",
            "predict_batch": "POST /predict/batch",
            "locations": "GET /locations",
            "features": "GET /features",
            "metrics": "GET /metrics",
            "model_info": "GET /model-info",
            "health": "GET /health",
        },
    }


@app.get("/health")
def healthcheck():
    return {
        "status": "OK",
        "code": 200,
        "model_loaded": "model" in artifacts,
        "features_count": len(get_feature_order()),
    }


@app.get("/features")
def get_features():
    """Returns the strict feature order expected by the model."""
    return {
        "count": len(get_feature_order()),
        "feature_order": get_feature_order(),
    }


@app.get("/metrics")
def get_metrics():
    """Returns the preserved evaluation metrics and feature importances."""
    return get_evaluation_metrics()


@app.get("/locations")
def get_locations():
    """Returns all 339 recognized locations available for frequency and target encoding."""
    locations = get_known_locations()
    return {
        "count": len(locations),
        "locations": locations,
    }


@app.get("/model-info")
def get_model_info():
    """Returns complete model metadata, evaluation metrics, and feature schema."""
    model = artifacts.get("model")
    return {
        "model_type": type(model).__name__ if model else None,
        "features": get_feature_order(),
        "metrics": get_evaluation_metrics(),
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_price(payload: PropertyFeaturesInput):
    """Predicts house price based on property parameters (area, location, bedrooms, type, amenities).

    - Converts categories and amenities to exact numeric encoding matching feature_cols.
    - Resolves location to frequency and target encoded values.
    - Applies trained imputer for missing values.
    - Returns predicted price in Millions PKR and full PKR.
    """
    if "model" not in artifacts:
        raise HTTPException(status_code=503, detail="Model is not ready or failed to load.")
    try:
        return predict_single(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.post("/predict/batch", response_model=BatchPredictionResponse)
def predict_price_batch(payload: BatchPredictionRequest):
    """Batch prediction endpoint for multiple properties."""
    if "model" not in artifacts:
        raise HTTPException(status_code=503, detail="Model is not ready or failed to load.")
    try:
        return predict_batch(payload.properties)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")
