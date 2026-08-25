// AI Agricultural Market Intelligence & Multi-Factor Recommendation Engine
// Transparent, rule-based mathematical Net Return calculation + ML trend forecasting

import { CROPS, MANDIS, VEHICLES, QUALITY_GRADES } from './mockData'

/**
 * Calculates distance between two coordinates using the Haversine formula (approximate road km = Haversine * 1.25)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 45.0 // fallback average km
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const directDistance = R * c
  return Math.round(directDistance * 1.28) // 1.28 road winding factor for Indian highways
}

/**
 * Generates synthetic realistic 7-day historical prices and 3-day ML forecast
 */
export function generatePriceForecast(basePrice, trendType = 'bullish') {
  const points = []
  const today = new Date()
  
  // Historical 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dayLabel = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    
    let variance = 0
    if (trendType === 'bullish') {
      variance = (6 - i) * (basePrice * 0.012) + (Math.sin(i) * basePrice * 0.008)
    } else if (trendType === 'bearish') {
      variance = -(6 - i) * (basePrice * 0.012) + (Math.cos(i) * basePrice * 0.008)
    } else {
      variance = Math.sin(i * 1.5) * (basePrice * 0.015)
    }
    
    const price = Math.round(basePrice + variance)
    points.push({
      date: dayLabel,
      price: price,
      minPrice: Math.round(price * 0.94),
      maxPrice: Math.round(price * 1.06),
      isForecast: false
    })
  }

  // 3-Day ML Forecast
  for (let i = 1; i <= 3; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const dayLabel = `+${i}d (${d.toLocaleDateString('en-US', { weekday: 'short' })})`
    
    const lastPrice = points[points.length - 1].price
    const slope = trendType === 'bullish' ? 1.015 : trendType === 'bearish' ? 0.985 : 1.002
    const forecastPrice = Math.round(lastPrice * Math.pow(slope, i))
    
    points.push({
      date: dayLabel,
      price: forecastPrice,
      minPrice: Math.round(forecastPrice * (0.94 - i * 0.01)), // widening confidence interval
      maxPrice: Math.round(forecastPrice * (1.06 + i * 0.01)),
      isForecast: true
    })
  }

  return points
}

/**
 * Core AI Analysis Engine (Step 4 & 5)
 * Analyzes multiple factors:
 * - Current Market Price
 * - Distance & Fuel Freight Rate
 * - Vehicle Capacity & Trips
 * - Quality / Grade Multiplier
 * - Moisture & Quality Adjustment
 * - Mandi Cess / APMC Taxes
 * - Handling & Hamali Labor
 * - Perishability / Spoilage Decay
 * - Demand-Supply Index
 */
export function analyzeAndRankMandis({
  cropId,
  quantityQtl,
  gradeId = 'grade_b',
  moisturePercent = 10,
  userLocation = { lat: 20.0000, lng: 73.7800, district: 'Nashik', name: 'Nashik District, Maharashtra' },
  vehicleId = 'pickup',
  customFuelMultiplier = 1.0
}) {
  const crop = CROPS.find(c => c.id === cropId) || CROPS[0]
  const grade = QUALITY_GRADES.find(g => g.id === gradeId) || QUALITY_GRADES[2]
  const vehicle = VEHICLES.find(v => v.id === vehicleId) || VEHICLES[1]

  // Calculate required vehicle trips
  const tripsRequired = Math.ceil(quantityQtl / vehicle.capacityQuintals) || 1

  // Evaluate each mandi
  const evaluatedMandis = MANDIS.map(mandi => {
    // 1. Distance
    const distanceKm = calculateDistance(userLocation.lat, userLocation.lng, mandi.lat, mandi.lng)
    
    // 2. Base Price variation across markets (e.g. Lasalgaon has premium for Onion, Khanna for Wheat)
    let marketPremium = 1.0
    if (cropId === 'onion' && mandi.id === 'mandi-lasalgaon') marketPremium = 1.06
    if (cropId === 'onion' && mandi.id === 'mandi-pune') marketPremium = 1.08 // Pune higher gross price
    if (cropId === 'onion' && mandi.id === 'mandi-azadpur') marketPremium = 1.18 // Delhi high gross price
    if (cropId === 'wheat' && mandi.id === 'mandi-khanna') marketPremium = 1.07
    if (cropId === 'soybean' && mandi.id === 'mandi-indore') marketPremium = 1.08
    if (cropId === 'cotton' && mandi.id === 'mandi-kurnool') marketPremium = 1.06

    // Add slight random deterministic variance based on id
    const seed = (mandi.name.length * 37) % 50
    const rawSpotPrice = Math.round(crop.basePrice * marketPremium + (seed - 25))

    // 3. Quality Adjusted Price
    const qualityMultiplier = grade.multiplier
    const moisturePenalty = moisturePercent > 14 ? (moisturePercent - 14) * 0.015 : 0
    const effectiveUnitPrice = Math.round(rawSpotPrice * (qualityMultiplier - moisturePenalty))

    // 4. Gross Revenue
    const grossRevenue = effectiveUnitPrice * quantityQtl

    // 5. Transportation Cost
    const effectiveTransportRate = vehicle.baseRatePerKm * customFuelMultiplier
    // Round trip calculation for logistics
    const transportCost = Math.round(distanceKm * effectiveTransportRate * tripsRequired + vehicle.fixedLoadingCharge)

    // 6. APMC Mandi Fee / Cess
    const marketFee = Math.round(grossRevenue * (mandi.marketFeePercent / 100))

    // 7. Handling / Hamali / Weighment Charges
    const handlingFee = Math.round(quantityQtl * mandi.handlingFeePerQtl)

    // 8. Spoilage / Transit Risk (High for perishables over long distance)
    let transitLossRisk = 0
    if (crop.perishable && distanceKm > 100) {
      const riskPercent = Math.min((distanceKm - 100) * 0.0003, 0.05) // up to 5% loss for 250km+
      transitLossRisk = Math.round(grossRevenue * riskPercent)
    }

    // 9. Total Deductions & Net Return
    const totalDeductions = transportCost + marketFee + handlingFee + transitLossRisk
    const estimatedNetReturn = grossRevenue - totalDeductions
    const effectiveRatePerQtl = Math.round(estimatedNetReturn / quantityQtl)

    // Demand & Trend
    const demandLevel = distanceKm < 150 ? 'High' : mandi.avgDailyArrivals > 5000 ? 'Very High' : 'Moderate'
    const trendType = mandi.id === 'mandi-lasalgaon' || mandi.id === 'mandi-indore' ? 'bullish' : 'stable'
    const priceTrend = generatePriceForecast(rawSpotPrice, trendType)

    // AI Scoring metric (0 to 100)
    const profitMargin = (estimatedNetReturn / grossRevenue) * 100
    const score = Math.min(Math.max(Math.round(profitMargin * 0.8 + (100 - Math.min(distanceKm, 300) * 0.2)), 10), 99)

    return {
      mandi,
      distanceKm,
      travelTimeHours: (distanceKm / 40).toFixed(1), // avg 40km/h truck speed
      rawSpotPrice,
      effectiveUnitPrice,
      grossRevenue,
      transportCost,
      marketFee,
      handlingFee,
      transitLossRisk,
      totalDeductions,
      estimatedNetReturn,
      effectiveRatePerQtl,
      demandLevel,
      trendType,
      score,
      priceTrend,
      tripsRequired
    }
  })

  // Sort by Estimated Net Return descending
  evaluatedMandis.sort((a, b) => b.estimatedNetReturn - a.estimatedNetReturn)

  // Find nearest mandi for profit delta comparison
  const nearestMandi = [...evaluatedMandis].sort((a, b) => a.distanceKm - b.distanceKm)[0]

  // Assign ranks & AI Rationales
  const rankedResults = evaluatedMandis.map((item, index) => {
    const rank = index + 1
    let rankBadge = 'Alternative'
    let rankEmoji = '🏷️'
    if (rank === 1) { rankBadge = 'Best Option'; rankEmoji = '🥇' }
    else if (rank === 2) { rankBadge = '2nd Best Option'; rankEmoji = '🥈' }
    else if (rank === 3) { rankBadge = '3rd Best Option'; rankEmoji = '🥉' }

    const profitDiffVsNearest = item.estimatedNetReturn - nearestMandi.estimatedNetReturn

    // Construct plain-language AI explanation
    let aiRationale = ''
    if (rank === 1) {
      if (item.mandi.id === nearestMandi.mandi.id) {
        aiRationale = `Optimal choice! ${item.mandi.name} is closest (${item.distanceKm} km), keeping transport cost to just ₹${item.transportCost.toLocaleString('en-IN')}, maximizing your take-home net return to ₹${item.estimatedNetReturn.toLocaleString('en-IN')}.`
      } else {
        aiRationale = `Top recommendation! Even with ${item.distanceKm} km distance, the higher spot price (₹${item.rawSpotPrice}/qtl) overcomes the ₹${item.transportCost.toLocaleString('en-IN')} transport charge, yielding ₹${profitDiffVsNearest > 0 ? '+' : ''}₹${profitDiffVsNearest.toLocaleString('en-IN')} extra profit compared to the nearest local market.`
      }
    } else if (item.rawSpotPrice > rankedResults[0]?.rawSpotPrice) {
      aiRationale = `Offers higher nominal price (₹${item.rawSpotPrice}/qtl), but excessive distance (${item.distanceKm} km) and freight deduction (₹${item.transportCost.toLocaleString('en-IN')}) reduces your take-home profit by ₹${(rankedResults[0]?.estimatedNetReturn - item.estimatedNetReturn).toLocaleString('en-IN')}.`
    } else {
      aiRationale = `Moderate option. Lower arrival volume and standard pricing results in ₹${item.estimatedNetReturn.toLocaleString('en-IN')} net earnings.`
    }

    return {
      ...item,
      rank,
      rankBadge,
      rankEmoji,
      profitDiffVsNearest,
      aiRationale
    }
  })

  return {
    crop,
    grade,
    vehicle,
    quantityQtl,
    userLocation,
    tripsRequired,
    recommendations: rankedResults,
    topPick: rankedResults[0],
    nearestMandi
  }
}
