import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Sprout,
  Truck,
  TrendingUp,
  Sliders,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  CloudSun,
  Bell,
  Download,
  Plus
} from 'lucide-react'
import { CROPS, MANDIS, DEMO_ORDERS } from '../services/mockData'

export default function FarmerPortalPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const farmerProfile = {
    name: 'Adarsh Dubey',
    kisanId: 'MH-NSK-KSN-4892',
    phone: '+91 98765 43210',
    village: 'Chandwad Village',
    district: 'Nashik',
    state: 'Maharashtra',
    farmSizeAcres: 12.5,
    kccStatus: 'Verified (Kisan Credit Card)',
    primaryCrop: 'Onion & Wheat'
  }

  const activeLots = [
    {
      id: 'LOT-2026-01',
      crop: 'Onion (Garwa Rabi)',
      quantityQtl: 50,
      grade: 'Grade A (Superior)',
      status: 'IN_TRANSIT',
      statusText: 'In Transit to Lasalgaon APMC',
      estimatedNet: '₹1,19,462.50',
      orderId: 'AGRO-ORD-2026-881'
    },
    {
      id: 'LOT-2026-02',
      crop: 'Wheat (Sharbati)',
      quantityQtl: 80,
      grade: 'Grade A+ (Premium)',
      status: 'STORAGE',
      statusText: 'In Farm Storage (Ventilated)',
      estimatedNet: '₹1,82,400.00',
      orderId: null
    },
    {
      id: 'LOT-2026-03',
      crop: 'Tomato (Hybrid Vaishali)',
      quantityQtl: 25,
      grade: 'Grade A',
      status: 'HARVESTING',
      statusText: 'Harvesting in 2 Days',
      estimatedNet: '₹46,250.00',
      orderId: null
    }
  ]

  const salesHistory = [
    {
      id: 'INV-2026-772',
      date: '18 Aug 2026',
      crop: 'Onion (Nashik Red)',
      quantity: '40 Qtl',
      mandi: 'Pimpalgaon APMC',
      gross: '₹98,000',
      deductions: '₹3,450',
      netCredit: '₹94,550',
      status: 'PAID_BANK'
    },
    {
      id: 'INV-2026-614',
      date: '02 Aug 2026',
      crop: 'Soybean (JS-335)',
      quantity: '60 Qtl',
      mandi: 'Indore APMC',
      gross: '₹2,95,200',
      deductions: '₹8,100',
      netCredit: '₹2,87,100',
      status: 'PAID_UPI'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner & Profile Header */}
      <div className="bg-gradient-to-r from-agro-900 via-slate-900 to-agro-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-agro-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-agro-500 to-harvest-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
            AD
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-white">{farmerProfile.name}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-0.5" /> KCC Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Kisan ID: <span className="font-mono text-agro-300 font-bold">{farmerProfile.kisanId}</span> &bull; {farmerProfile.village}, {farmerProfile.district} ({farmerProfile.state})
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Landholding: <strong>{farmerProfile.farmSizeAcres} Acres</strong> &bull; Primary: <strong>{farmerProfile.primaryCrop}</strong>
            </p>
          </div>
        </div>

        {/* Quick Season Earnings Summary */}
        <div className="bg-white/10 backdrop-blur border border-white/20 p-5 rounded-2xl text-left md:text-right min-w-[220px]">
          <span className="text-[10px] uppercase font-bold text-agro-300 block tracking-wider">
            Total Net Realized (Season)
          </span>
          <div className="text-3xl font-black text-white mt-0.5">₹3,81,650</div>
          <span className="text-xs font-semibold text-emerald-400">100% Escrow Guaranteed</span>
        </div>
      </div>

      {/* Quick Launchpad Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/farmer/recommend"
          className="p-5 bg-white rounded-2xl border-2 border-agro-600 shadow-sm hover:shadow-md hover:bg-agro-50/50 transition group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-agro-100 text-agro-700 flex items-center justify-center group-hover:scale-110 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Find Best Mandi</h4>
          <p className="text-xs text-slate-500">8-Step AI Net Return Recommendation</p>
        </Link>

        <Link
          to="/farmer/orders"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-agro-400 hover:bg-slate-50 transition group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Active Orders & GPS</h4>
          <p className="text-xs text-slate-500">Live truck tracking & payout OTP</p>
        </Link>

        <Link
          to="/farmer/simulation"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-agro-400 hover:bg-slate-50 transition group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
            <Sliders className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">What-If Simulator</h4>
          <p className="text-xs text-slate-500">Simulate fuel spikes & crop quantities</p>
        </Link>

        <Link
          to="/test-scenarios"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:bg-slate-50 transition group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Test Benchmarks</h4>
          <p className="text-xs text-slate-500">Live evaluation stress test suite</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Active Crop Batches & Sales History */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Crop Lots */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Active Harvest Batches & Crop Lots</h3>
                <p className="text-xs text-slate-500">Real-time status of current standing and harvested commodities.</p>
              </div>
              <Link
                to="/farmer/recommend"
                className="inline-flex items-center text-xs font-bold text-agro-700 hover:text-agro-800"
              >
                <Plus className="w-4 h-4 mr-1" /> New Batch
              </Link>
            </div>

            <div className="space-y-3">
              {activeLots.map((lot) => (
                <div
                  key={lot.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-agro-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{lot.crop}</span>
                      <span className="font-mono text-xs text-slate-400 font-bold">({lot.quantityQtl} Qtl)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{lot.grade}</p>
                    <div className="mt-1 flex items-center space-x-1.5">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          lot.status === 'IN_TRANSIT'
                            ? 'bg-harvest-100 text-harvest-800 animate-pulse'
                            : lot.status === 'STORAGE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {lot.statusText}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Net Return</span>
                    <span className="font-black text-agro-800 text-base">{lot.estimatedNet}</span>
                    {lot.orderId ? (
                      <Link
                        to="/farmer/orders"
                        className="block text-xs font-bold text-agro-600 hover:underline mt-0.5"
                      >
                        Track GPS &rarr;
                      </Link>
                    ) : (
                      <Link
                        to="/farmer/recommend"
                        className="block text-xs font-bold text-slate-600 hover:underline mt-0.5"
                      >
                        Calculate Mandis &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade History & Electronic Invoices */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Completed Mandi Settlements</h3>
                <p className="text-xs text-slate-500">Government-compliant trade ledgers and direct bank credits.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-3">Invoice & Date</th>
                    <th className="py-3 px-3">Crop & Qty</th>
                    <th className="py-3 px-3">APMC Mandi</th>
                    <th className="py-3 px-3">Net Payout</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {salesHistory.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {h.id}
                        <span className="block text-[10px] font-normal text-slate-400">{h.date}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold">{h.crop} &bull; {h.quantity}</td>
                      <td className="py-3 px-3">{h.mandi}</td>
                      <td className="py-3 px-3 font-mono font-black text-agro-800">{h.netCredit}</td>
                      <td className="py-3 px-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center w-max">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Settled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Kisan Telemetry & Mandi Bell */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Weather & Soil Advisory */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <CloudSun className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm text-white">Kisan Weather Telemetry</h4>
              </div>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                Chandwad, Nashik
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-white">28° C</div>
                <p className="text-xs text-slate-300">Clear Skies &bull; Humidity: 58%</p>
              </div>
              <div className="text-right text-xs text-emerald-400 font-bold">
                Optimal Harvesting<br />Window Active
              </div>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
              No rain forecast for the next 72 hours. Excellent conditions for field drying onions and loading transport trucks.
            </p>
          </div>

          {/* Real-time Mandi Price Alert Bell */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Bell className="w-4 h-4 text-agro-600" />
              <h4>Live APMC Market Alerts</h4>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-agro-50 rounded-xl border border-agro-200 text-agro-950 space-y-1">
                <span className="font-bold text-agro-800 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> Lasalgaon Onion Modal Rate ↗
                </span>
                <p className="text-[11px] text-agro-900">
                  Spot prices increased by <strong>+₹150/q (to ₹2,450/q)</strong> due to high export orders.
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 space-y-1">
                <span className="font-bold text-amber-800">
                  ⚠️ Pune Mandi Heavy Arrivals
                </span>
                <p className="text-[11px] text-amber-900">
                  Arrivals exceeded 6,200 Qtl. Freight deduction outweighs gross advantage.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
