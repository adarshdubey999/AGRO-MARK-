"""
Agro Mark FastAPI Application
AI-Based Personalized Agricultural Market Intelligence & Best-Market Recommendation System
with Online Selling & Delivery Tracking
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime
import math

app = FastAPI(
    title="Agro Mark API",
    description="AI-Based Agricultural Market Intelligence & Best-Market Recommendation System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory realistic dataset
CROPS_DB = [
    {"id": "onion", "name": "Onion", "hindiName": "कांदा / प्याज", "category": "Vegetable", "icon": "🧅", "basePrice": 2450.0, "msp": 1800.0, "varieties": ["Nashik Red", "Garwa (Rabi)", "White Onion"], "shelfLifeDays": 45},
    {"id": "wheat", "name": "Wheat", "hindiName": "गेहूं", "category": "Grain", "icon": "🌾", "basePrice": 2320.0, "msp": 2275.0, "varieties": ["Sharbati", "Lokwan", "HD-2967"], "shelfLifeDays": 180},
    {"id": "rice", "name": "Paddy / Rice", "hindiName": "धान", "category": "Grain", "icon": "🍚", "basePrice": 2250.0, "msp": 2183.0, "varieties": ["Basmati 1121", "Sona Masoori"], "shelfLifeDays": 365},
    {"id": "tomato", "name": "Tomato", "hindiName": "टमाटर", "category": "Vegetable", "icon": "🍅", "basePrice": 1950.0, "msp": 1200.0, "varieties": ["Hybrid Vaishali", "Abhinav"], "shelfLifeDays": 7},
    {"id": "cotton", "name": "Cotton", "hindiName": "कपास", "category": "Cash Crop", "icon": "☁️", "basePrice": 7150.0, "msp": 7020.0, "varieties": ["BT Cotton Hybrid", "Shankar-6"], "shelfLifeDays": 180},
    {"id": "soybean", "name": "Soybean", "hindiName": "सोयाबीन", "category": "Oilseed", "icon": "🌱", "basePrice": 4920.0, "msp": 4892.0, "varieties": ["JS-335", "JS-9560"], "shelfLifeDays": 120},
]

MANDIS_DB = [
    {"id": "mandi-lasalgaon", "name": "Lasalgaon APMC", "district": "Nashik", "state": "Maharashtra", "lat": 20.1472, "lng": 74.2268, "transportRatePerKm": 12.5, "marketFeePercent": 1.0, "handlingFeePerQtl": 20.0, "avgDailyArrivals": 3500},
    {"id": "mandi-pimpalgaon", "name": "Pimpalgaon Baswant APMC", "district": "Nashik", "state": "Maharashtra", "lat": 20.1718, "lng": 73.9856, "transportRatePerKm": 12.0, "marketFeePercent": 1.0, "handlingFeePerQtl": 20.0, "avgDailyArrivals": 2800},
    {"id": "mandi-nashik", "name": "Nashik City APMC", "district": "Nashik", "state": "Maharashtra", "lat": 19.9975, "lng": 73.7898, "transportRatePerKm": 12.0, "marketFeePercent": 1.0, "handlingFeePerQtl": 22.0, "avgDailyArrivals": 2100},
    {"id": "mandi-pune", "name": "Pune APMC (Gultekdi)", "district": "Pune", "state": "Maharashtra", "lat": 18.4988, "lng": 73.8647, "transportRatePerKm": 14.0, "marketFeePercent": 1.25, "handlingFeePerQtl": 25.0, "avgDailyArrivals": 6200},
    {"id": "mandi-azadpur", "name": "Azadpur Mandi", "district": "North Delhi", "state": "Delhi", "lat": 28.7088, "lng": 77.1751, "transportRatePerKm": 16.0, "marketFeePercent": 1.5, "handlingFeePerQtl": 30.0, "avgDailyArrivals": 14500},
    {"id": "mandi-indore", "name": "Indore APMC", "district": "Indore", "state": "Madhya Pradesh", "lat": 22.7196, "lng": 75.8577, "transportRatePerKm": 13.0, "marketFeePercent": 1.0, "handlingFeePerQtl": 22.0, "avgDailyArrivals": 5100}
]

ORDERS_DB = []

# Schemas
class RecommendationRequest(BaseModel):
    crop_id: str
    quantity_qtl: float
    grade_multiplier: Optional[float] = 1.0
    user_lat: Optional[float] = 20.3256
    user_lng: Optional[float] = 74.2415
    transport_rate_per_km: Optional[float] = 15.0

class OrderCreate(BaseModel):
    farmerName: str
    farmerPhone: str
    originLocation: str
    cropId: str
    cropName: str
    variety: str
    quantityQtl: float
    grade: str
    mandiId: str
    mandiName: str
    agreedPricePerQtl: float
    grossAmount: float
    transportCost: float
    mandiFee: float
    handlingFee: float
    netFarmerPayout: float
    distanceKm: Optional[float] = 45.0
    buyer: Optional[Dict[str, Any]] = None
    transporter: Optional[Dict[str, Any]] = None

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Agro Mark AI Backend Server",
        "version": "1.0.0",
        "diagram_steps_supported": 8
    }

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.get("/api/crops")
def get_crops():
    return CROPS_DB

@app.get("/api/mandis")
def get_mandis():
    return MANDIS_DB

@app.post("/api/recommend")
def calculate_recommendation(req: RecommendationRequest):
    crop = next((c for c in CROPS_DB if c["id"] == req.crop_id), CROPS_DB[0])
    results = []

    for mandi in MANDIS_DB:
        # Distance calculation
        dlat = (mandi["lat"] - req.user_lat) * 111.0
        dlng = (mandi["lng"] - req.user_lng) * 105.0
        distance_km = round(math.sqrt(dlat*dlat + dlng*dlng) * 1.25)
        
        # Spot price
        spot_price = crop["basePrice"]
        if req.crop_id == "onion" and mandi["id"] == "mandi-lasalgaon":
            spot_price *= 1.06
        elif req.crop_id == "onion" and mandi["id"] == "mandi-pune":
            spot_price *= 1.08

        effective_price = spot_price * req.grade_multiplier
        gross_revenue = effective_price * req.quantity_qtl
        transport_cost = distance_km * req.transport_rate_per_km + 400.0
        market_fee = gross_revenue * (mandi["marketFeePercent"] / 100.0)
        handling_fee = req.quantity_qtl * mandi["handlingFeePerQtl"]
        total_deductions = transport_cost + market_fee + handling_fee
        net_return = gross_revenue - total_deductions

        results.append({
            "mandi": mandi,
            "distance_km": distance_km,
            "raw_spot_price": round(spot_price, 2),
            "gross_revenue": round(gross_revenue, 2),
            "transport_cost": round(transport_cost, 2),
            "market_fee": round(market_fee, 2),
            "handling_fee": round(handling_fee, 2),
            "estimated_net_return": round(net_return, 2),
            "effective_rate_per_qtl": round(net_return / req.quantity_qtl, 2)
        })

    results.sort(key=lambda x: x["estimated_net_return"], reverse=True)
    return {
        "crop": crop,
        "quantity_qtl": req.quantity_qtl,
        "recommendations": results,
        "top_pick": results[0]
    }

@app.get("/api/orders")
def get_orders():
    return ORDERS_DB

@app.post("/api/orders")
def create_order(order: OrderCreate):
    order_dict = order.dict()
    order_dict["id"] = f"AGRO-ORD-{datetime.datetime.now().year}-{len(ORDERS_DB) + 101}"
    order_dict["status"] = "ORDER_PLACED"
    order_dict["otpCode"] = "4829"
    order_dict["escrowStatus"] = "ESCROW_LOCKED_20%"
    order_dict["orderDate"] = datetime.datetime.now().isoformat()
    order_dict["milestones"] = [
        {"step": 1, "title": "Order Placed & Deal Locked", "completed": True, "timestamp": "Just now", "details": f"Price locked at ₹{order.agreedPricePerQtl}/qtl."},
        {"step": 2, "title": "Transporter Assigned & Pickup Scheduled", "completed": False, "timestamp": "Pending", "details": "Transporter scheduled for farm gate loading."},
        {"step": 3, "title": "In Transit (Live GPS Tracking)", "completed": False, "timestamp": "Upcoming", "details": "Real-time telemetry tracking."},
        {"step": 4, "title": "Out for Delivery / Mandi Gate Weighment", "completed": False, "timestamp": "Upcoming", "details": "Electronic weighbridge verification."},
        {"step": 5, "title": "Delivered & Instant Payout Released", "completed": False, "timestamp": "Pending OTP", "details": f"Release full payout of ₹{order.netFarmerPayout:,.2f} via OTP."}
    ]
    ORDERS_DB.insert(0, order_dict)
    return order_dict
