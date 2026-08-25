import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sliders,
  TrendingUp,
  Fuel,
  Sparkles,
  RotateCcw,
  Trophy,
  ArrowRight,
  Calculator,
  ShieldAlert,
  CloudRain
} from 'lucide-react'
import { CROPS, MANDIS, QUALITY_GRADES, VEHICLES } from '../services/mockData'
import { analyzeAndRankMandis } from '../services/aiEngine'

export default function SimulationPage() {
  const [cropId, setCropId] = useState('onion')
  const [quantityQtl, setQuantityQtl] = useState(50)
  const [gradeId, setGradeId] = useState('grade_a')
  const [vehicleId, setVehicleId] = useState('pickup')
  const [fuelMultiplier, setFuelMultiplier] = useState(1.0) // 1.0 = normal, 1.25 = +25% fuel hike
  const [weatherRisk, setWeatherRisk] = useState(false)

  // Run calculation with current simulation parameters
  const baseResult = analyzeAndRankMandis({
    cropId,
    quantityQtl,
    gradeId,
    vehicleId,
    customFuelMultiplier: 1.0
  })

  const simulatedResult = analyzeAndRankMandis({
    cropId,
    quantityQtl,
    gradeId,
    vehicleId,
    customFuelMultiplier: fuelMultiplier
  })

  const currentCrop = CROPS.find(c => c.id === cropId) || CROPS[0]
  const netDelta = simulatedResult.topPick.estimatedNetReturn - baseResult.topPick.estimatedNetReturn

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-harvest-100 text-harvest-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-harvest-600" />
            <span>Interactive What-If Market Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            What-If Market Scenario Simulator
          </h1>
          <p className="text-sm text-slate-500">
            Simulate fuel price hikes, quantity changes, quality grade upgrades, and weather disruptions.
          </p>
        </div>

        <button
          onClick={() => {
            setFuelMultiplier(1.0)
            setQuantityQtl(50)
            setGradeId('grade_a')
            setWeatherRisk(false)
          }}
          className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Scenario Controls */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base flex items-center">
            <Sliders className="w-4 h-4 mr-2 text-agro-600" />
            <span>Simulation Parameters</span>
          </h3>

          {/* 1. Crop Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Crop Commodity:</label>
            <select
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-agro-500 font-semibold"
            >
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.hindiName}) - Base: ₹{c.basePrice}/q
                </option>
              ))}
            </select>
          </div>

          {/* 2. Fuel Hike Multiplier */}
          <div className="space-y-2 p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80">
            <div className="flex justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center">
                <Fuel className="w-4 h-4 mr-1 text-amber-700" />
                Diesel & Fuel Freight Surge:
              </span>
              <span>
                {fuelMultiplier === 1.0 ? 'Normal Rate' : `+${Math.round((fuelMultiplier - 1) * 100)}% Surge`}
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.6"
              step="0.05"
              value={fuelMultiplier}
              onChange={(e) => setFuelMultiplier(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-amber-700 font-medium">
              <span>-20% Subsidized</span>
              <span>Standard</span>
              <span>+60% Fuel Crisis</span>
            </div>
          </div>

          {/* 3. Quantity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Harvest Quantity:</span>
              <span className="text-agro-700 font-mono">{quantityQtl} Quintals ({(quantityQtl * 100).toLocaleString('en-IN')} kg)</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={quantityQtl}
              onChange={(e) => setQuantityQtl(Number(e.target.value))}
              className="w-full accent-agro-600"
            />
          </div>

          {/* 4. Grade Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Quality / Grading Level:</label>
            <div className="grid grid-cols-2 gap-2">
              {QUALITY_GRADES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGradeId(g.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                    gradeId === g.id
                      ? 'border-agro-600 bg-agro-50 text-agro-900 ring-1 ring-agro-500'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">{g.name.split(' ')[0]} {g.name.split(' ')[1]}</div>
                  <div className="text-[10px] text-slate-500">{g.multiplier > 1 ? `+${g.priceBonusPercent}%` : `${g.priceBonusPercent}%`}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Simulation Output & Impact Analysis */}
        <div className="lg:col-span-7 space-y-6">
          {/* Winner Impact Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-agro-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-harvest-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
                Simulated Top Market
              </span>
              <span className="text-xs text-slate-400">Real-Time Recalculation</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {simulatedResult.topPick.mandi.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Distance: {simulatedResult.topPick.distanceKm} km &bull; Fuel Multiplier: {fuelMultiplier.toFixed(2)}x
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-agro-300 block">Simulated Net Return</span>
                <div className="text-3xl font-black text-white">
                  ₹{simulatedResult.topPick.estimatedNetReturn.toLocaleString('en-IN')}
                </div>
                {netDelta !== 0 && (
                  <span className={`text-xs font-bold ${netDelta > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {netDelta > 0 ? `+₹${netDelta.toLocaleString('en-IN')}` : `-₹${Math.abs(netDelta).toLocaleString('en-IN')}`} vs baseline
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Side by side comparison table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              Mandi Impact Rankings under Current Scenario
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Mandi</th>
                    <th className="py-2.5 px-2">Distance</th>
                    <th className="py-2.5 px-2">Spot Price</th>
                    <th className="py-2.5 px-2 text-red-600">Simulated Freight</th>
                    <th className="py-2.5 px-3 text-agro-800 font-bold">Simulated Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {simulatedResult.recommendations.slice(0, 4).map((item) => (
                    <tr key={item.mandi.id} className={item.rank === 1 ? 'bg-agro-50/70 font-semibold' : ''}>
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center space-x-1">
                        <span>{item.rankEmoji}</span>
                        <span>{item.mandi.name}</span>
                      </td>
                      <td className="py-2.5 px-2">{item.distanceKm} km</td>
                      <td className="py-2.5 px-2 font-mono">₹{item.rawSpotPrice}</td>
                      <td className="py-2.5 px-2 font-mono text-red-600">₹{item.transportCost.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-agro-800 text-sm">
                        ₹{item.estimatedNetReturn.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-agro-50 rounded-2xl border border-agro-100 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">
              Want to lock this deal and sell to <strong>{simulatedResult.topPick.mandi.name}</strong>?
            </span>
            <Link
              to="/farmer/recommend"
              className="inline-flex items-center px-4 py-2 bg-agro-600 hover:bg-agro-700 text-white font-bold rounded-xl transition shadow-xs"
            >
              <span>Launch 8-Step Flow</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
