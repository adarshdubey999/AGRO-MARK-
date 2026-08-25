import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sprout,
  TrendingUp,
  MapPin,
  Calculator,
  Bot,
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BarChart3,
  Truck,
  CheckCircle2,
  HelpCircle,
  Trophy,
  ShoppingCart,
  FileSpreadsheet,
  Layers,
  ChevronRight
} from 'lucide-react'
import { CROPS, MANDIS } from '../services/mockData'

export default function LandingPage() {
  const [demoCrop, setDemoCrop] = useState('onion')
  const [demoQty, setDemoQty] = useState(50) // quintals

  // Live interactive card calculation (Lasalgaon vs Pune)
  const lasalgaonPrice = 2450
  const lasalgaonDistance = 45
  const lasalgaonTransport = lasalgaonDistance * 12 * Math.ceil(demoQty / 30) + 400
  const lasalgaonGross = lasalgaonPrice * demoQty
  const lasalgaonNet = lasalgaonGross - lasalgaonTransport - (lasalgaonGross * 0.01) - (demoQty * 20)

  const punePrice = 2500 // higher gross price
  const puneDistance = 210
  const puneTransport = puneDistance * 14 * Math.ceil(demoQty / 30) + 600
  const puneGross = punePrice * demoQty
  const puneNet = puneGross - puneTransport - (puneGross * 0.0125) - (demoQty * 25)

  const netAdvantage = lasalgaonNet - puneNet

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-agro-50/80 via-white to-slate-50 border-b border-agro-100 py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Pitch */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-agro-100 text-agro-800 border border-agro-200 shadow-xs">
                <Sparkles className="w-4 h-4 mr-1.5 text-agro-600" />
                SIH Hackathon Project &bull; AI Agricultural Intelligence
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Sell Smarter. <br />
                <span className="text-agro-700 underline decoration-harvest-400 decoration-4">Earn Better.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                The AI-powered agricultural intelligence platform that calculates <span className="font-bold text-slate-800">Estimated Net Return</span> across APMC mandis—deducting real transport rates, fuel, and handling charges, so farmers never lose money chasing deceptive gross prices.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/farmer/recommend"
                  className="inline-flex justify-center items-center px-7 py-4 text-base font-bold text-white bg-agro-600 hover:bg-agro-700 rounded-2xl shadow-xl shadow-agro-600/25 transition-all"
                >
                  <span>Find Best Market (8-Step Flow)</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex justify-center items-center px-6 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl transition shadow-xs"
                >
                  How It Works
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-agro-200/60 max-w-lg">
                <div>
                  <div className="text-2xl font-black text-agro-800">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Transparent Net Return</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-agro-800">10+</div>
                  <div className="text-xs text-slate-500 font-medium">Major APMC Mandis</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-agro-800">Gemini AI</div>
                  <div className="text-xs text-slate-500 font-medium">Decision Guidance</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Live Example Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-agro-100 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">🧅</span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Interactive Live Net Return Demo</h4>
                      <p className="text-xs text-slate-500">Nashik Farmer &bull; Onion Harvest</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                    Live Formula
                  </span>
                </div>

                {/* Slider for Quantity */}
                <div className="py-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Adjust Harvest Quantity:</span>
                    <span className="text-agro-700">{demoQty} Quintals ({(demoQty * 100).toLocaleString('en-IN')} kg)</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="10"
                    value={demoQty}
                    onChange={(e) => setDemoQty(Number(e.target.value))}
                    className="w-full accent-agro-600"
                  />
                </div>

                {/* Side by side cards */}
                <div className="space-y-3">
                  {/* Recommended Winner (Lasalgaon) */}
                  <div className="p-4 rounded-2xl bg-agro-50/90 border-2 border-agro-600 shadow-sm relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-agro-900 text-sm">Lasalgaon APMC</span>
                        <span className="text-[9px] bg-agro-600 text-white font-black px-1.5 py-0.5 rounded">
                          RECOMMENDED
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{lasalgaonDistance} km away</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-agro-200/60 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Spot Price: ₹{lasalgaonPrice}/q</span>
                        <span className="text-slate-500 text-[10px]">Transport: -₹{lasalgaonTransport.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-agro-800">
                          ₹{Math.round(lasalgaonNet).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-agro-600 font-bold block">Estimated Net Return</span>
                      </div>
                    </div>
                  </div>

                  {/* Misleading High Gross Market (Pune) */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 opacity-80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">Pune APMC (Gultekdi)</span>
                        <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                          Higher Gross (+₹50/q)
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{puneDistance} km away</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Spot Price: ₹{punePrice}/q</span>
                        <span className="text-red-500 text-[10px]">Transport: -₹{puneTransport.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-semibold text-slate-700">
                          ₹{Math.round(puneNet).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-red-500 font-bold block">
                          -₹{Math.round(netAdvantage).toLocaleString('en-IN')} Less Net Return
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Rationale Insight Box */}
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                  <Bot className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Gemini AI Rationale:</strong> While Pune advertises a higher rate (₹2,500 vs ₹2,450), the 210 km haul costs ₹{puneTransport.toLocaleString('en-IN')}, causing you to lose <strong>₹{Math.round(netAdvantage).toLocaleString('en-IN')}</strong> in net profit compared to Lasalgaon!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8-Step Architecture Workflow Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold text-agro-700 uppercase tracking-wider">End-To-End Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Complete 8-Step Agricultural Intelligence Pipeline
          </h2>
          <p className="text-slate-600 text-sm">
            Everything from crop selection and multi-factor AI scoring to online contract lock and live GPS delivery tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: 1, title: 'Crop Selection', desc: 'Select crop, variety, quantity (kg/qtl), and quality grade (A+ to C).', icon: Sprout },
            { step: 2, title: 'Location & Logistics', desc: 'Auto-detect GPS, detect nearby mandis, and choose vehicle transport.', icon: MapPin },
            { step: 3, title: 'Mandi Comparison', desc: 'Real-time APMC raw market prices, arrivals, cess, and handling fees.', icon: Scale },
            { step: 4, title: 'AI Analysis Engine', desc: 'Multi-factor evaluation: freight, quality multiplier, distance & trends.', icon: Cpu },
            { step: 5, title: 'Best Market Rec', desc: 'Ranked leaderboard (🥇 Best Option, 🥈 2nd, 🥉 3rd) with Net Return.', icon: Trophy },
            { step: 6, title: 'Online Selling', desc: 'Lock deals with verified APMC buyers with guaranteed tripartite escrow.', icon: ShoppingCart },
            { step: 7, title: 'Delivery Tracking', desc: 'Live GPS vehicle telemetry, milestone checklist, and OTP confirmation.', icon: Truck },
            { step: 8, title: 'Farmer Report', desc: 'Complete executive dossier with itemized ledger, price charts, and PDF export.', icon: FileSpreadsheet }
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.step} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-agro-400 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-agro-100 text-agro-700 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Step {item.step}</span>
                  <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/farmer/recommend"
            className="inline-flex items-center px-8 py-4 bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-agro-600/20 transition"
          >
            <span>Start 8-Step Farmer Journey Now</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
