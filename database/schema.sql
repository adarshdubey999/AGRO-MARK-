-- AgroMarket Database Schema
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'farmer',
    state VARCHAR(50),
    district VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crops (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(10),
    default_unit VARCHAR(20) DEFAULT 'quintal',
    base_price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS mandis (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    transport_rate_per_km DECIMAL(6, 2) DEFAULT 12.00,
    market_fee_percent DECIMAL(4, 2) DEFAULT 1.00,
    handling_fee_per_qtl DECIMAL(6, 2) DEFAULT 20.00
);

CREATE TABLE IF NOT EXISTS mandi_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mandi_id VARCHAR(50) NOT NULL,
    crop_id VARCHAR(50) NOT NULL,
    price_per_quintal DECIMAL(10, 2) NOT NULL,
    min_price DECIMAL(10, 2),
    max_price DECIMAL(10, 2),
    arrival_volume_quintals DECIMAL(10, 2),
    recorded_date DATE NOT NULL,
    FOREIGN KEY (mandi_id) REFERENCES mandis(id),
    FOREIGN KEY (crop_id) REFERENCES crops(id)
);

CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    crop_id VARCHAR(50) NOT NULL,
    quantity_quintals DECIMAL(10, 2) NOT NULL,
    farmer_location VARCHAR(150) NOT NULL,
    recommended_mandi_id VARCHAR(50) NOT NULL,
    estimated_net_return DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recommended_mandi_id) REFERENCES mandis(id)
);
