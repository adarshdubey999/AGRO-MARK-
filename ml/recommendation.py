"""
AgroMarket ML & Mathematical Recommendation Core
Transparent Net Return calculation without black-box bias.
"""

def calculate_net_return(selling_price_per_qtl: float,
                         quantity_qtl: float,
                         distance_km: float,
                         transport_rate_per_km: float,
                         market_fee_percent: float = 1.0,
                         handling_fee_per_qtl: float = 20.0):
    """
    Transparent Rule-Based Net Return Formula:
    1. Gross Revenue = Selling Price * Quantity
    2. Transport Cost = Distance * Rate per KM
    3. Market Fee = Gross Revenue * (Market Fee % / 100)
    4. Handling Fee = Quantity * Handling Fee per Qtl
    5. Net Return = Gross Revenue - Transport Cost - Market Fee - Handling Fee
    """
    gross_revenue = selling_price_per_qtl * quantity_qtl
    transport_cost = distance_km * transport_rate_per_km
    market_fee = gross_revenue * (market_fee_percent / 100.0)
    handling_fee = quantity_qtl * handling_fee_per_qtl
    total_deductions = transport_cost + market_fee + handling_fee
    net_return = gross_revenue - total_deductions
    effective_rate_per_qtl = net_return / quantity_qtl if quantity_qtl > 0 else 0

    return {
        "gross_revenue": round(gross_revenue, 2),
        "transport_cost": round(transport_cost, 2),
        "market_fee": round(market_fee, 2),
        "handling_fee": round(handling_fee, 2),
        "total_deductions": round(total_deductions, 2),
        "estimated_net_return": round(net_return, 2),
        "effective_rate_per_qtl": round(effective_rate_per_qtl, 2)
    }
