<p align="center">
  <img src="client/public/Logo.png" alt="MakanMeter Logo" width="80" height="80" />
</p>

<h1 align="center">MakanMeter</h1>

<p align="center">
  <strong>Institutional-Grade Real Estate Valuation & Predictive Modeling Studio for Lahore Residential Properties</strong>
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15.0-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" /></a>
  <a href="https://scikit-learn.org/"><img src="https://img.shields.io/badge/Scikit--Learn-1.5-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="Scikit-Learn" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" /></a>
</p>

---

## Overview

**MakanMeter** is a machine-learning-driven residential property valuation platform designed for the Lahore real estate market. It combines an ensemble Random Forest regressor with a real-time financial simulation workbench, interactive sensitivity sliders, geospatial price benchmarks, and automated feature attribution charts.

Built on cross-validated listings from the **Zameen.com (2025)** dataset, MakanMeter provides transparent algorithmic price discovery, deviation confidence intervals, and institutional analytics without arbitrary black-box outputs.

---

## Key Features

- **Live Dynamic Valuation Engine**: Real-time pricing calculations based on area (Marla / Kanal / Sq. Ft), location target-encoding, bedroom count, bathrooms, store rooms, and premium amenities.
- **Micro-Sensitivity Adjusters**: Instant steppers for floor level, servant quarters, drawing room, dining room, furnished state, and corner plot orientation.
- **Valuation Contribution Attribution**: High-density interactive donut chart inspired by `@reui/c-chart-19`, showing precise PKR and percentage contributions (Land Area, Location Geospatial, Layout, and Luxury Finishes).
- **Benchmark & Model Diagnostics Modal**: Complete algorithmic audit view showcasing candidate algorithms (Random Forest, Gradient Boosting, LightGBM, Linear Regression), MAE, RMSE, and holdout R² validation.
- **339+ Autocomplete Lahore Sectors**: Fast search indexing DHA Phase 1–9, Bahria Town, Gulberg, Model Town, Johar Town, Cantt, Lake City, and more.
- **Institutional Dark Design System**: Built with modern slate surfaces, subtle glass borders, tabular numbers, Inter typography, and zero layout shift.

---

## Machine Learning Architecture & Visuals

The core valuation pipeline uses an ensemble **Random Forest Regressor (100 estimators, max depth 12)** calibrated against non-linear spatial interactions and outlier-cleaned property records.

### 1. Parameter Importance & Variance Attribution
Land area and location target encoding capture the vast majority of price variance, followed by functional room layout and structural amenities:

![Feature Importance & Contribution](Images/contribution%20of%20each%20parameter%20in%20prediction.png)

### 2. Geospatial Pricing & Area Corridors
Relationship between land area (Marla), prime locality premium, and realized sale price:

![Location Area Price Analysis](Images/analysis%20of%20the%20relationship%20between%20Location,%20area%20and%20price.png)

### 3. Outlier Filtration & Robust Interquartile Range (IQR)
Cleaned distribution removing extreme anomalies and spurious listing inputs:

![Outliers via IQR](Images/outliers%20via%20IQR.png)

### 4. Bedroom Count vs. Price Distribution
Exploratory distribution demonstrating non-linear scaling across multi-family residential formats:

![Exploratory Data Analysis Bed Rooms](Images/exploratory%20data%20analysis%20of%20bed%20rooms%20and%20price.png)

---

## Empirical Benchmark Matrix

Cross-validated across 1,248+ stratified holdout records from curated 2025 Lahore listings:

| Algorithm Candidate | MAE (PKR) | RMSE (PKR) | R² Score | Status |
| :--- | :---: | :---: | :---: | :---: |
| **Random Forest Regressor (Champion)** | **15.25 Lakh** | **23.40 Lakh** | **0.8800** | **Production Champion** |
| Gradient Boosting (XGBoost) | 16.10 Lakh | 24.85 Lakh | 0.8650 | Candidate |
| LightGBM Regressor | 16.80 Lakh | 25.30 Lakh | 0.8520 | Candidate |
| Linear Regression Baseline | 32.40 Lakh | 48.90 Lakh | 0.6400 | Baseline |

---

## Architecture & Technology Stack

```
MakanMeter/
├── client/                     # Next.js 15 App Router Frontend
│   ├── app/                    # Layout, globals.css & root page
│   ├── components/             # Reusable UI & Valuation studio components
│   │   ├── InteractiveValuation/ # PropertyForm, LiveValuationPanel, ResultDialog
│   │   ├── valuation/          # ValuationContributionPieChart (@reui/c-chart-19)
│   │   ├── ModelBenchmarksDialog.tsx # Algorithm matrix & feature weights
│   │   └── Footer.tsx          # Institutional footer & dataset attribution
│   ├── config/                 # Benchmarks, site metadata, valuation defaults
│   └── lib/                    # API client, sound synthesizer, formatting utils
│
├── Server/                     # FastAPI Machine Learning Backend
│   ├── app/
│   │   ├── model_loader.py     # Joblib artifact loader & schema extractor
│   │   ├── predictor.py        # Single & batch inference pipeline
│   │   ├── schemas/            # Pydantic validation models
│   │   └── metrics.json        # Preserved evaluation benchmarks
│   ├── model/
│   │   └── random_forest.joblib# Serialized model binary
│   └── main.py                 # FastAPI runner & route handlers
│
├── dataset/                    # Curated Lahore house listings CSV
├── Images/                     # EDA, outlier, & model feature importance charts
└── Notebooks/                  # Training, preprocessing & evaluation notebook
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.17+ or v20+
- **Python**: 3.10+
- **Package Managers**: `npm` and `pip`

---

### Backend Setup (FastAPI)

1. Navigate to the Server directory:
   ```bash
   cd Server
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the development API server:
   ```bash
   fastapi dev main.py
   # Or using uvicorn:
   # uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

API interactive documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

### Frontend Setup (Next.js)

1. Open a new terminal and navigate to `client`:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   *Make sure `NEXT_PUBLIC_API_URL` points to your backend (default: `http://localhost:8000`).*

4. Run the local dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/predict` | Single property price estimation with feature attribution |
| `POST` | `/predict/batch` | High-throughput bulk property valuations |
| `GET` | `/locations` | List all 339 recognized Lahore geospatial sectors |
| `GET` | `/features` | Returns expected feature ordering and encoding schema |
| `GET` | `/metrics` | Holdout evaluation statistics (MAE, RMSE, R²) |
| `GET` | `/model-info` | Model metadata and hyperparameters |
| `GET` | `/health` | Service health status and artifact verification |

---

## Dataset & Valuation Disclaimer

Valuation estimates are computed from empirical listings sourced from the **Zameen.com (2025) Lahore House Listings dataset**. Predictions represent statistical market benchmarks based on prevailing residential listing patterns and should be treated as guidance rather than formal bank collateral appraisals.

---

## Author & Acknowledgements

- **Developer**: [Ali Hamza](https://github.com/thealihamza04)
- **Repository**: [thealihamza04/MakanMeter](https://github.com/thealihamza04/MakanMeter)
