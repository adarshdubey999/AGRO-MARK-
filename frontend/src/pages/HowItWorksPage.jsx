import React from 'react'
import { Link } from 'react-router-dom'
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
  ShieldCheck,
  Calculator,
  TrendingUp,
  Sparkles
} from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      num: 1,
      title: 'Crop Selection',
      icon: Sprout,
      color: 'bg-emerald-500',
      bullets: [
        'Select commodity (Onion, Wheat, Paddy, Tomato, Cotton, Soybean, etc.)',
        'Specify variety (e.g. Sharbati, Basmati, Garwa Rabi)',
        'Enter harvest quantity with flexible units (kg, quintal, ton)',
        'Select Quality / Grade (Grade A+, A, B, C with moisture % adjustments)',
        'Choose expected selling and harvest timeframe'
      ],
      formula: 'Effective Unit Price = Base Spot Rate × Quality Multiplier - Moisture Penalty'
    },
    {
      num: 2,
      title: 'Location & Nearby Mandis',
      icon: MapPin,
      color: 'bg-blue-500',
      bullets: [
        'Detect GPS coordinates or manually select state and district',
        'Identify all operating APMC Mandis within 25km - 250km radius',
        'Compute exact road travel distance and travel time',
        'Choose vehicle class (Tata Ace, Mahindra Bolero, Tractor Trolley, Eicher 14ft, 10-Wheeler)'
      ],
      formula: 'Transportation Cost = (Distance × Rate/km × Trips) + Base Loading Charge'
    },
    {
      num: 3,
      title: 'Mandi Comparison (Raw Data)',
      icon: Scale,
      color: 'bg-amber-500',
      bullets: [
        'Ingest raw spot prices from Agmarknet feeds (Min, Modal, Max)',
        'Analyze daily arrival volume in quintals and buyer demand index',
        'Factor in APMC statutory market cess (1.0% - 1.5%)',
        'Collect hamali, weighing, bagging, and labor handling fees'
      ],
      formula: 'Statutory Mandi Deductions = APMC Cess + Handling/Hamali Charges'
    },
    {
      num: 4,
      title: 'AI Analysis Engine',
      icon: Cpu,
      color: 'bg-purple-500',
      bullets: [
        'Multi-factor neural & rule-based optimization engine',
        'Evaluates 11 distinct market dimensions simultaneously',
        'Applies shelf-life perishability risk for long distance transit',
        'Computes transparent mathematical Net Return without black-box bias'
      ],
      formula: 'Net Return = Gross Revenue - Transport Cost - Mandi Cess - Handling Fees - Spoilage Risk'
    },
    {
      num: 5,
      title: 'Best Market Recommendation',
      icon: Trophy,
      color: 'bg-harvest-500',
      bullets: [
        'Ranked leaderboard of markets: 🥇 Best Option, 🥈 2nd Best, 🥉 3rd Best',
        'Calculates exact extra profit (₹) compared to the nearest local market',
        'Generates natural language rationales with Google Gemini AI',
        'Interactive Scikit-Learn 3-day ML price trend forecast graph'
      ],
      formula: 'Leaderboard Ranking = Sorted by Highest Estimated Net Return (₹)'
    },
    {
      num: 6,
      title: 'Online Selling System',
      icon: ShoppingCart,
      color: 'bg-teal-500',
      bullets: [
        'One-click digital harvest listing direct to verified APMC buyers',
        'Choose licensed commission agents, institutional exporters, or FPOs',
        'Lock contract with AI auto-suggested or custom farmer asking price',
        'Tripartite escrow payment guarantee: 20% advance, 70% in-transit, 10% delivery'
      ],
      formula: 'Digital Contract Locked with Guaranteed Escrow Payout'
    },
    {
      num: 7,
      title: 'Delivery Tracking System',
      icon: Truck,
      color: 'bg-indigo-500',
      bullets: [
        'Instant transporter assignment with verified vehicle and driver details',
        'Interactive real-time GPS tracking route simulation',
        '5-Stage milestone progression (Placed &rarr; Picked Up &rarr; In Transit &rarr; At Gate &rarr; Delivered)',
        'Delivery verification via secure 4-digit OTP to release instant bank payout'
      ],
      formula: 'Live GPS Telemetry & OTP Payout Authorization'
    },
    {
      num: 8,
      title: 'Farmer Report & Analytics Dossier',
      icon: FileSpreadsheet,
      color: 'bg-rose-500',
      bullets: [
        'Comprehensive Farmer Intelligence Dossier',
        'Full itemized mathematical deductions ledger across all candidate mandis',
        'Price trajectory analytics & ROI metrics',
        'Download and print official PDF dossier & share via WhatsApp'
      ],
      formula: 'Official Verified Agriculture Optimization Certificate'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-agro-100 text-agro-800 border border-agro-200">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-agro-600" />
          Technical & Algorithmic Blueprint
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How Agro Mark Works
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          The step-by-step mathematical and AI architecture empowering Indian farmers to maximize real take-home net profits.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-8">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.num}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Stage {step.num} of 8
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                <div className="md:col-span-7 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Functions:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {step.bullets.map((b, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-agro-600 font-bold mt-0.5">&bull;</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-center space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Governing Formula / Logic:
                  </span>
                  <p className="font-mono text-xs font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                    {step.formula}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-br from-agro-900 to-slate-900 text-white rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold">Ready to Experience the 8-Step System?</h3>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Start with crop and location input to find the highest-paying APMC market for your harvest.
        </p>
        <Link
          to="/farmer/recommend"
          className="inline-flex items-center px-8 py-3.5 bg-harvest-500 hover:bg-harvest-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition"
        >
          <span>Launch Recommendation Engine</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  )
}
