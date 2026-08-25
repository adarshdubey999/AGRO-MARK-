import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Sprout,
  MapPin,
  Scale,
  Cpu,
  Trophy,
  ShoppingCart,
  Truck,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  Sliders,
  DollarSign,
  ChevronRight,
  Calendar,
  Layers,
  Search
} from 'lucide-react'
import StepProgressBar from '../components/StepProgressBar'
import PriceTrendChart from '../components/PriceTrendChart'
import LiveTrackingMap from '../components/LiveTrackingMap'
import GeminiInsightsCard from '../components/GeminiInsightsCard'
import PrintableReport from '../components/PrintableReport'
import {
  CROPS,
  MANDIS,
  QUALITY_GRADES,
  VEHICLES,
  VERIFIED_BUYERS,
  TRANSPORTERS,
  TRANSLATIONS
} from '../services/mockData'
import { analyzeAndRankMandis } from '../services/aiEngine'
import { apiService } from '../services/api'

export default function RecommendationFlowPage({ currentLang = 'en' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en

  // Current Step state (1 to 8)
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Crop Selection state
  const [selectedCropId, setSelectedCropId] = useState('onion')
  const [selectedVariety, setSelectedVariety] = useState('Garwa (Rabi)')
  const [quantityValue, setQuantityValue] = useState(50) // default 50
  const [quantityUnit, setQuantityUnit] = useState('quintal') // 'quintal' | 'kg' | 'ton'
  const [selectedGradeId, setSelectedGradeId] = useState('grade_a')
  const [moisturePercent, setMoisturePercent] = useState(10)
  const [sellingDate, setSellingDate] = useState(new Date().toISOString().split('T')[0])

  // Step 2: Location & Transport state
  const [userLocation, setUserLocation] = useState({
    district: 'Nashik',
    name: 'Chandwad Village, Nashik, Maharashtra',
    lat: 20.3256,
    lng: 74.2415
  })
  const [selectedVehicleId, setSelectedVehicleId] = useState('pickup')
  const [searchDistrict, setSearchDistrict] = useState('')

  // Step 3: Raw Mandi Comparison Search / Filter
  const [mandiFilterText, setMandiFilterText] = useState('')

  // Step 4 & 5: AI Analysis Result
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [selectedMandiForDeal, setSelectedMandiForDeal] = useState(null)

  // Step 6: Online Selling state
  const [selectedBuyerId, setSelectedBuyerId] = useState('buyer-101')
  const [pricingMode, setPricingMode] = useState('auto') // 'auto' | 'custom'
  const [customPricePerQtl, setCustomPricePerQtl] = useState(2450)
  const [farmerName, setFarmerName] = useState('Adarsh Dubey')
  const [farmerPhone, setFarmerPhone] = useState('+91 98765 43210')
  const [createdOrder, setCreatedOrder] = useState(null)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

  // Sync selected crop variety options
  const currentCrop = CROPS.find(c => c.id === selectedCropId) || CROPS[0]
  const currentGrade = QUALITY_GRADES.find(g => g.id === selectedGradeId) || QUALITY_GRADES[1]
  const currentVehicle = VEHICLES.find(v => v.id === selectedVehicleId) || VEHICLES[1]

  useEffect(() => {
    if (currentCrop && currentCrop.varieties?.length > 0) {
      if (!currentCrop.varieties.includes(selectedVariety)) {
        setSelectedVariety(currentCrop.varieties[0])
      }
    }
  }, [selectedCropId])

  useEffect(() => {
    if (currentStep === 4 || currentStep === 5) {
      if (!analysisResult) {
        runAiAnalysis()
      }
    }
  }, [currentStep])

  // Run AI Analysis Engine
  const runAiAnalysis = () => {
    setIsAnalyzing(true)
    let qtl = Number(quantityValue)
    if (quantityUnit === 'kg') qtl = qtl / 100
    if (quantityUnit === 'ton') qtl = qtl * 10

    setTimeout(() => {
      const result = analyzeAndRankMandis({
        cropId: selectedCropId,
        quantityQtl: qtl,
        gradeId: selectedGradeId,
        moisturePercent: Number(moisturePercent),
        userLocation: userLocation,
        vehicleId: selectedVehicleId
      })
      setAnalysisResult(result)
      setSelectedMandiForDeal(result.topPick)
      setCustomPricePerQtl(result.topPick.rawSpotPrice)
      setIsAnalyzing(false)
      setCurrentStep(5)
    }, 600)
  }

  // Handle Create Order (Step 6)
  const handleLockDealAndSell = async () => {
    if (!analysisResult || !selectedMandiForDeal) return
    setIsSubmittingOrder(true)

    const buyer = VERIFIED_BUYERS.find(b => b.id === selectedBuyerId) || VERIFIED_BUYERS[0]
    const transporter = TRANSPORTERS[0]

    const effectivePrice = pricingMode === 'auto' ? selectedMandiForDeal.rawSpotPrice : Number(customPricePerQtl)
    const gross = effectivePrice * analysisResult.quantityQtl
    const netPayout = gross - selectedMandiForDeal.transportCost - selectedMandiForDeal.marketFee - selectedMandiForDeal.handlingFee

    const payload = {
      farmerName,
      farmerPhone,
      originLocation: userLocation.name,
      cropId: currentCrop.id,
      cropName: `${currentCrop.name} (${currentCrop.hindiName})`,
      variety: selectedVariety,
      quantityQtl: analysisResult.quantityQtl,
      grade: currentGrade.name,
      mandiId: selectedMandiForDeal.mandi.id,
      mandiName: selectedMandiForDeal.mandi.name,
      agreedPricePerQtl: effectivePrice,
      grossAmount: gross,
      transportCost: selectedMandiForDeal.transportCost,
      mandiFee: selectedMandiForDeal.marketFee,
      handlingFee: selectedMandiForDeal.handlingFee,
      netFarmerPayout: netPayout,
      distanceKm: selectedMandiForDeal.distanceKm,
      buyer: buyer,
      transporter: transporter
    }

    const order = await apiService.createOrder(payload)
    setCreatedOrder(order)
    setIsSubmittingOrder(false)
    setCurrentStep(7) // Go to Step 7: Delivery Tracking
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 8-Step Interactive Pipeline Bar */}
      <StepProgressBar currentStep={currentStep} onStepClick={(s) => setCurrentStep(s)} />

      {/* STEP 1: CROP SELECTION */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-agro-700 uppercase tracking-wider">Step 1 of 8</span>
              <h2 className="text-2xl font-bold text-slate-900">Select Crop & Harvest Details</h2>
              <p className="text-sm text-slate-500">Provide harvest specifications for accurate Net Return prediction.</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-agro-100 text-agro-700 flex items-center justify-center font-bold">
              <Sprout className="w-6 h-6" />
            </div>
          </div>

          {/* 1. Crop Selection Grid */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-800">
              1. Choose Commodity / Crop:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {CROPS.map((crop) => {
                const isSelected = crop.id === selectedCropId
                return (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCropId(crop.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-2 border-agro-600 bg-agro-50/80 shadow-md ring-2 ring-agro-200'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="text-2xl mb-1">{crop.icon}</div>
                    <div className="font-bold text-slate-900 text-sm leading-tight">{crop.name}</div>
                    <div className="text-xs text-slate-500">{crop.hindiName}</div>
                    <div className="text-[11px] font-semibold text-agro-700 mt-2">
                      Base: ₹{crop.basePrice}/q
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Variety & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">
                2. Select Variety:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {currentCrop.varieties.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariety(v)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                      selectedVariety === v
                        ? 'border-agro-600 bg-agro-50 text-agro-900 ring-1 ring-agro-500'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-800">
                  3. Harvest Quantity:
                </label>
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                  {['quintal', 'kg', 'ton'].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setQuantityUnit(unit)}
                      className={`px-2.5 py-1 rounded-md uppercase transition ${
                        quantityUnit === unit ? 'bg-white text-agro-800 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantityValue}
                  onChange={(e) => setQuantityValue(Math.max(1, Number(e.target.value)))}
                  className="w-36 px-4 py-2.5 text-lg font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-agro-500 focus:outline-none"
                />
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={quantityValue}
                  onChange={(e) => setQuantityValue(Number(e.target.value))}
                  className="flex-grow accent-agro-600"
                />
                <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                  = {quantityUnit === 'quintal' ? quantityValue * 100 : quantityValue} kg
                </span>
              </div>
            </div>
          </div>

          {/* 3. Quality / Grade Cards */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-bold text-slate-800">
              4. Quality / Grade Selection:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {QUALITY_GRADES.map((g) => {
                const isSelected = g.id === selectedGradeId
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGradeId(g.id)}
                    className={`p-4 rounded-2xl border text-left transition relative ${
                      isSelected
                        ? 'border-2 border-agro-600 bg-agro-50 shadow-md ring-2 ring-agro-200'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${g.badgeColor}`}>
                        {g.multiplier > 1.0 ? `+${g.priceBonusPercent}% Bonus` : g.multiplier < 1.0 ? `${g.priceBonusPercent}% Disc` : 'Base Price'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">{g.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{g.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. Expected Selling Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800 flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-agro-600" />
                Expected Selling / Harvest Date:
              </label>
              <input
                type="date"
                value={sellingDate}
                onChange={(e) => setSellingDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-agro-500 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">
                Moisture Level (%): <span className="text-agro-700 font-mono">{moisturePercent}%</span>
              </label>
              <input
                type="range"
                min="6"
                max="25"
                value={moisturePercent}
                onChange={(e) => setMoisturePercent(Number(e.target.value))}
                className="w-full accent-agro-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Optimal (&lt;10%)</span>
                <span>Standard (12-14%)</span>
                <span>High Moisture (&gt;15%)</span>
              </div>
            </div>
          </div>

          {/* Bottom Next Step CTA */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center px-6 py-3.5 bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-agro-600/20 transition-all"
            >
              <span>Continue to Step 2: Location & Logistics</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: LOCATION & LOGISTICS */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-agro-700 uppercase tracking-wider">Step 2 of 8</span>
              <h2 className="text-2xl font-bold text-slate-900">Your Location & Transportation Fleet</h2>
              <p className="text-sm text-slate-500">Detect neighboring APMC Mandis and vehicle freight rates.</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-agro-100 text-agro-700 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-800">
                Select Your District / Farm Origin:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Chandwad, Nashik (MH)', district: 'Nashik', lat: 20.3256, lng: 74.2415 },
                  { name: 'Niphad, Nashik (MH)', district: 'Nashik', lat: 20.0880, lng: 74.1100 },
                  { name: 'Baramati, Pune (MH)', district: 'Pune', lat: 18.1517, lng: 74.5771 },
                  { name: 'Sanwer, Indore (MP)', district: 'Indore', lat: 22.9772, lng: 75.8335 },
                  { name: 'Karnal, Haryana', district: 'Karnal', lat: 29.6857, lng: 76.9905 },
                  { name: 'Kurnool, AP', district: 'Kurnool', lat: 15.8281, lng: 78.0373 }
                ].map((loc) => {
                  const isSelected = userLocation.name === loc.name
                  return (
                    <button
                      key={loc.name}
                      onClick={() => setUserLocation(loc)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition ${
                        isSelected
                          ? 'border-2 border-agro-600 bg-agro-50 text-agro-900'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-agro-600" />
                        <span>{loc.name}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">GPS Geolocation Coordinates</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  GPS Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Coordinates: <span className="font-mono text-slate-800">{userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E</span>
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                Detected <strong>6 neighboring APMC Mandis</strong> within 150 km radius.
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-sm font-bold text-slate-800">
              Select Logistics Vehicle / Transport Mode:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VEHICLES.map((v) => {
                const isSelected = v.id === selectedVehicleId
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`p-4 rounded-2xl border text-left transition relative ${
                      isSelected
                        ? 'border-2 border-agro-600 bg-agro-50 shadow-md ring-2 ring-agro-200'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{v.icon}</div>
                    <h4 className="font-bold text-slate-900 text-sm">{v.name}</h4>
                    <div className="text-xs text-slate-500 mt-0.5">Capacity: {v.capacityQuintals} Quintals ({v.capacityKg} kg)</div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                      <span className="text-agro-700 font-bold">₹{v.baseRatePerKm} / km</span>
                      <span className="text-slate-400 text-[10px]">+{v.fixedLoadingCharge} base</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to Crop</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center px-6 py-3.5 bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-agro-600/20 transition"
            >
              <span>Continue to Step 3: Raw Mandi Comparison</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MANDI COMPARISON (RAW DATA) */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div>
              <span className="text-xs font-bold text-agro-700 uppercase tracking-wider">Step 3 of 8</span>
              <h2 className="text-2xl font-bold text-slate-900">Mandi Comparison (Raw Market Data)</h2>
              <p className="text-sm text-slate-500">Live prices, arrivals, and APMC fees before AI deductions.</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter mandis..."
                value={mandiFilterText}
                onChange={(e) => setMandiFilterText(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-agro-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Mandi / Market</th>
                  <th className="py-3.5 px-3">State & District</th>
                  <th className="py-3.5 px-3">Spot Price (₹/q)</th>
                  <th className="py-3.5 px-3">Daily Arrivals</th>
                  <th className="py-3.5 px-3">APMC Cess %</th>
                  <th className="py-3.5 px-3">Handling Fee</th>
                  <th className="py-3.5 px-3">Operating Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {MANDIS.filter(m => m.name.toLowerCase().includes(mandiFilterText.toLowerCase()) || m.district.toLowerCase().includes(mandiFilterText.toLowerCase())).map((mandi) => (
                  <tr key={mandi.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-agro-500" />
                      <span>{mandi.name}</span>
                    </td>
                    <td className="py-3 px-3">{mandi.district}, {mandi.state}</td>
                    <td className="py-3 px-3 font-mono font-bold text-agro-800 text-sm">
                      ₹{currentCrop.basePrice + ((mandi.name.length * 37) % 50) - 25}/q
                    </td>
                    <td className="py-3 px-3">{mandi.avgDailyArrivals.toLocaleString('en-IN')} Qtl</td>
                    <td className="py-3 px-3 font-mono">{mandi.marketFeePercent}%</td>
                    <td className="py-3 px-3 font-mono">₹{mandi.handlingFeePerQtl}/q</td>
                    <td className="py-3 px-3 text-slate-500">{mandi.tradingHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                setCurrentStep(4)
                runAiAnalysis()
              }}
              className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-agro-600 to-agro-800 hover:from-agro-700 hover:to-agro-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-agro-600/20 transition"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Launch Step 4: AI Analysis Engine</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI ANALYSIS ENGINE (SCANNING ANIMATION) */}
      {currentStep === 4 && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl text-center space-y-8 animate-fadeIn">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-agro-500 to-harvest-500 mx-auto flex items-center justify-center shadow-xl shadow-agro-500/20 animate-spin">
              <Cpu className="w-10 h-10 text-slate-950" />
            </div>
            <h3 className="text-2xl font-bold text-white">AI Multi-Factor Analysis Engine Running</h3>
            <p className="text-sm text-slate-400">
              Evaluating 11 dynamic parameters: spot prices, road distance, truck freight, moisture penalty, APMC cess, and shelf-life risks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-xs">
            {['Current Market Price', 'Transportation Freight', 'Demand & Supply Ratios', 'Moisture & Quality', 'Historical Trends', 'APMC Mandi Taxes', 'Transit Shelf Life', 'Take-Home Net Return'].map((factor) => (
              <div key={factor} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center space-x-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-agro-400 animate-pulse" />
                <span className="font-medium text-left">{factor}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                if (!analysisResult) runAiAnalysis();
                else setCurrentStep(5);
              }}
              className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-agro-600 to-harvest-500 hover:from-agro-500 hover:to-harvest-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              <span>View Step 5: Best Market Recommendations</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: BEST MARKET RECOMMENDATION (LEADERBOARD & WINNER) */}
      {currentStep === 5 && analysisResult && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-br from-agro-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-agro-700/60 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-harvest-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Step 5: Top Recommended Market</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {analysisResult.topPick.mandi.name}
                </h2>
                <p className="text-sm text-slate-300">
                  {analysisResult.topPick.mandi.district}, {analysisResult.topPick.mandi.state} &bull; Distance:{' '}
                  <strong>{analysisResult.topPick.distanceKm} km</strong> &bull; Travel Time:{' '}
                  <strong>~{analysisResult.topPick.travelTimeHours} hrs</strong>
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 p-5 rounded-2xl text-left lg:text-right min-w-[240px]">
                <span className="text-xs uppercase font-bold text-agro-300 block tracking-wider">
                  Estimated Net Return
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mt-0.5">
                  ₹{analysisResult.topPick.estimatedNetReturn.toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-1">
                  ₹{analysisResult.topPick.effectiveRatePerQtl}/qtl Net Take-Home
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-300 max-w-xl">
                <strong>Why this is best:</strong> {analysisResult.topPick.aiRationale}
              </div>
              <button
                onClick={() => setCurrentStep(6)}
                className="inline-flex items-center justify-center px-6 py-3 bg-harvest-500 hover:bg-harvest-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
              >
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                <span>Sell Crop Online (Step 6)</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analysisResult.recommendations.slice(0, 3).map((item) => (
              <div
                key={item.mandi.id}
                className={`bg-white rounded-2xl p-5 border shadow-sm space-y-4 transition ${
                  item.rank === 1
                    ? 'border-2 border-agro-600 ring-2 ring-agro-100'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-full flex items-center space-x-1 ${
                      item.rank === 1
                        ? 'bg-agro-600 text-white'
                        : item.rank === 2
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span>{item.rankEmoji}</span>
                    <span>{item.rankBadge}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-400">Score: {item.score}/100</span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base">{item.mandi.name}</h4>
                  <p className="text-xs text-slate-500">{item.distanceKm} km away &bull; Spot: ₹{item.rawSpotPrice}/q</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Gross Revenue:</span>
                    <span className="font-semibold text-slate-900">₹{item.grossRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Transport Freight:</span>
                    <span>-₹{item.transportCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Mandi Fee & Cess:</span>
                    <span>-₹{item.marketFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Hamali & Labor:</span>
                    <span>-₹{item.handlingFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-200 font-bold text-slate-900">
                    <span>Net Return:</span>
                    <span className="text-agro-700 text-sm">₹{item.estimatedNetReturn.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedMandiForDeal(item)
                    setCustomPricePerQtl(item.rawSpotPrice)
                    setCurrentStep(6)
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                    item.rank === 1
                      ? 'bg-agro-600 hover:bg-agro-700 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Choose {item.mandi.name} &rarr;
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <GeminiInsightsCard
                recommendation={analysisResult.topPick}
                cropName={currentCrop.name}
                mandiName={analysisResult.topPick.mandi.name}
                currentLang={currentLang}
              />
            </div>
            <div className="lg:col-span-6">
              <PriceTrendChart
                data={analysisResult.topPick.priceTrend}
                cropName={currentCrop.name}
                mandiName={analysisResult.topPick.mandi.name}
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: ONLINE SELLING SYSTEM */}
      {currentStep === 6 && selectedMandiForDeal && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-agro-700 uppercase tracking-wider">Step 6 of 8</span>
              <h2 className="text-2xl font-bold text-slate-900">Online Selling & Escrow Deal Lock</h2>
              <p className="text-sm text-slate-500">
                Sell directly to verified APMC commission agents with guaranteed escrow payment.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-agro-100 text-agro-700 flex items-center justify-center font-bold">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-800">
                  1. Choose Verified Buyer / Trader at {selectedMandiForDeal.mandi.name}:
                </label>
                <div className="space-y-2.5">
                  {VERIFIED_BUYERS.map((buyer) => {
                    const isSelected = buyer.id === selectedBuyerId
                    return (
                      <button
                        key={buyer.id}
                        onClick={() => setSelectedBuyerId(buyer.id)}
                        className={`w-full p-4 rounded-2xl border text-left transition relative flex items-center justify-between ${
                          isSelected
                            ? 'border-2 border-agro-600 bg-agro-50/70 shadow-sm'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">{buyer.name}</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
                              <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{buyer.type} &bull; Lic: {buyer.licenseNo}</p>
                          <p className="text-[11px] text-agro-700 font-semibold mt-1">Payment: {buyer.paymentSpeed}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-800">★ {buyer.rating}</span>
                          <span className="text-[10px] text-slate-400 block">{buyer.dealsCount}+ deals</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-sm font-bold text-slate-800">
                  2. Pricing Strategy:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPricingMode('auto')}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      pricingMode === 'auto'
                        ? 'border-agro-600 bg-agro-50 ring-1 ring-agro-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-agro-700 uppercase">AI Auto-Suggested</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">₹{selectedMandiForDeal.rawSpotPrice} / quintal</div>
                    <p className="text-[11px] text-slate-500 mt-1">Current live modal rate at {selectedMandiForDeal.mandi.name}</p>
                  </button>

                  <button
                    onClick={() => setPricingMode('custom')}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      pricingMode === 'custom'
                        ? 'border-agro-600 bg-agro-50 ring-1 ring-agro-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Custom Farmer Asking</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">Set Your Price</div>
                    <p className="text-[11px] text-slate-500 mt-1">Lock contract at desired target price</p>
                  </button>
                </div>

                {pricingMode === 'custom' && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter Target Price (₹ per quintal):
                    </label>
                    <input
                      type="number"
                      value={customPricePerQtl}
                      onChange={(e) => setCustomPricePerQtl(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-mono font-bold text-base focus:ring-2 focus:ring-agro-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Name:</label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-agro-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile (for OTP):</label>
                  <input
                    type="text"
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-agro-500"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-base">Digital Contract & Escrow Ledger</h4>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Crop & Variety:</span>
                  <span className="font-bold text-slate-900">{currentCrop.name} ({selectedVariety})</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-bold text-slate-900">{analysisResult.quantityQtl} Quintals</span>
                </div>
                <div className="flex justify-between">
                  <span>Destination Mandi:</span>
                  <span className="font-bold text-slate-900">{selectedMandiForDeal.mandi.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Agreed Price / Qtl:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{pricingMode === 'auto' ? selectedMandiForDeal.rawSpotPrice : customPricePerQtl}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Gross Contract Value:</span>
                  <span className="font-bold text-slate-900">
                    ₹{((pricingMode === 'auto' ? selectedMandiForDeal.rawSpotPrice : customPricePerQtl) * analysisResult.quantityQtl).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Logistics Transport:</span>
                  <span>-₹{selectedMandiForDeal.transportCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Mandi Fees:</span>
                  <span>-₹{selectedMandiForDeal.marketFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Hamali / Labor:</span>
                  <span>-₹{selectedMandiForDeal.handlingFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm">
                  <span className="text-slate-900">Net Farmer Payout:</span>
                  <span className="text-agro-700 font-black">
                    ₹{(((pricingMode === 'auto' ? selectedMandiForDeal.rawSpotPrice : customPricePerQtl) * analysisResult.quantityQtl) - selectedMandiForDeal.totalDeductions).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <div className="font-bold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Tripartite Escrow Guarantee:
                </div>
                <p>20% locked upon deal confirmation &bull; 70% upon truck loading &bull; Final 10% on OTP delivery.</p>
              </div>

              <button
                onClick={handleLockDealAndSell}
                disabled={isSubmittingOrder}
                className="w-full py-3.5 bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-agro-600/20 transition flex items-center justify-center space-x-2"
              >
                {isSubmittingOrder ? (
                  <span>Locking Contract...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Order & Dispatch Truck</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: DELIVERY TRACKING SYSTEM */}
      {currentStep === 7 && (
        <div className="space-y-6 animate-fadeIn">
          {createdOrder ? (
            <LiveTrackingMap
              order={createdOrder}
              onUpdateOrder={(id, data) => setCreatedOrder(data)}
              onVerifyOtp={apiService.verifyDeliveryOtp}
            />
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center space-y-4">
              <p>No active order in session. Loading demo shipment...</p>
            </div>
          )}

          <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h4 className="font-bold text-slate-900 text-base">Step 8: Farmer Intelligence Dossier</h4>
              <p className="text-xs text-slate-500">View complete executive summary and download official PDF report.</p>
            </div>
            <button
              onClick={() => setCurrentStep(8)}
              className="inline-flex items-center px-6 py-3 bg-agro-600 hover:bg-agro-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              <span>Generate Step 8 Farmer Report</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: FARMER REPORT & ANALYTICS */}
      {currentStep === 8 && analysisResult && (
        <div className="space-y-6 animate-fadeIn">
          <PrintableReport
            analysisResult={analysisResult}
            orderData={createdOrder}
            onClose={() => setCurrentStep(5)}
          />
        </div>
      )}
    </div>
  )
}
