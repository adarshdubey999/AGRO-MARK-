# AI-Based Personalized Agricultural Market Intelligence & Best-Market Recommendation System

> **SIH Hackathon Project MVP**  
> "Sell Smarter. Earn Better."

An intelligent decision-support system for Indian farmers to identify the most profitable agricultural market (mandi) for their harvest. Instead of naively recommending the market with the highest nominal price, our transparent recommendation engine calculates the **Estimated Net Return** by balancing dynamic transportation costs, market distance, historical price trends, and grade/quantity factors, supported by Scikit-Learn price forecasting and Gemini AI natural language guidance.

---

## 🌟 Key Features

1. **Rule-Based Transparent Net Return Engine**
   - $\text{Estimated Net Return} = (\text{Selling Price} \times \text{Quantity}) - (\text{Distance} \times \text{Transport Rate/km}) - \text{Mandi Fees}$
   - Transparent scoring breakdown without black-box confusion.
2. **Machine Learning Price Trend & Forecasting (Scikit-Learn)**
   - Seasonal and trend-aware price prediction across agricultural mandis.
3. **Generative AI Market Insights (Google Gemini)**
   - Contextual, farmer-friendly rationales and interactive Q&A assistant (without hallucinating prices).
4. **What-If Market Scenario Simulator**
   - Real-time simulation of fuel price hikes, quantity changes, and price fluctuations.
5. **Farmer & Admin Portals**
   - Modern, responsive React + Tailwind CSS interface with Indian agricultural visual identity.

---

## 📂 Project Structure

```
├── frontend/             # React + Vite + Tailwind CSS User Interface
│   ├── src/
│   │   ├── assets/       # Icons, logos, and graphics
│   │   ├── components/   # Modular, accessible UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Public, Farmer, and Admin views
│   │   ├── services/     # API integration & mock services
│   │   ├── App.jsx       # Routing & core application shell
│   │   └── main.jsx      # Vite entry point
├── backend/              # FastAPI Backend API Server
│   ├── database/         # Database connection & migrations
│   ├── models/           # SQLAlchemy ORM models
│   ├── routes/           # REST API endpoints (Auth, Mandi, Recommendation, AI)
│   ├── schemas/          # Pydantic validation schemas
│   ├── services/         # Business logic & calculation services
│   └── main.py           # FastAPI entry point
├── ml/                   # Machine Learning Models & Pipelines
│   ├── preprocessing.py  # Data cleaning and feature engineering
│   ├── train.py          # Scikit-Learn model training script
│   ├── prediction.py     # Price prediction engine
│   └── recommendation.py # Transparent scoring algorithms
├── database/             # SQL Schemas & Seed Data
│   ├── schema.sql        # Database table definitions
│   └── seed.sql          # Realistic Indian mandi & crop dataset
├── data/                 # Sample CSV Datasets
│   ├── crops.csv         # Supported Indian crops & varieties
│   ├── mandis.csv        # Mandi locations and base rates
│   └── mandi_prices.csv  # Historical & current market price records
├── docs/                 # Documentation
│   ├── architecture.md   # System architecture & data flow
│   └── api.md            # API endpoint specifications
├── .env.example          # Environment variables template
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
