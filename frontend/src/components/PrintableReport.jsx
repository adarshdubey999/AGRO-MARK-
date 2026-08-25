import React from 'react'
import {
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Sprout,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Truck,
  ArrowRight
} from 'lucide-react'

export default function PrintableReport({ analysisResult, orderData, onClose }) {
  if (!analysisResult) return null

  const { crop, grade, vehicle, quantityQtl, userLocation, recommendations, topPick } = analysisResult
  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const reportId = `AGRO-RPT-${Math.floor(100000 + Math.random() * 900000)}`

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl space-y-8 max-w-4xl mx-auto print:p-0 print:border-none print:shadow-none">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-2.5 py-1 bg-agro-100 text-agro-800 rounded-md">
            Official Farmer Intelligence Dossier
          </span>
          <span className="text-xs text-slate-500 font-mono">ID: {reportId}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-agro-600 hover:bg-agro-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Print / Save as PDF
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-agro-700 text-white flex items-center justify-center font-bold text-xl shadow">
            <Sprout className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Agro<span className="text-harvest-600">Mark</span></h2>
              <span className="text-[10px] bg-slate-100 font-mono px-1.5 py-0.5 rounded text-slate-700 border border-slate-300">
                VERIFIED INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              AI Agricultural Market Intelligence & Best-Market Recommendation System
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs space-y-0.5">
          <p className="font-bold text-slate-900">Dossier Generated: {reportDate}</p>
          <p className="text-slate-500">Origin: {userLocation?.name || 'Nashik District, Maharashtra'}</p>
          <p className="text-agro-700 font-semibold">Government AGMARKNET Standard Compliance</p>
        </div>
      </div>

      {/* 1. Crop & Logistics Input Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
        <div>
          <span className="text-slate-400 block font-medium">Commodity</span>
          <span className="font-bold text-slate-900 text-sm">{crop?.name} ({crop?.hindiName})</span>
        </div>
        <div>
          <span className="text-slate-400 block font-medium">Harvest Batch Quantity</span>
          <span className="font-bold text-slate-900 text-sm">{quantityQtl} Quintals ({(quantityQtl * 100).toLocaleString('en-IN')} kg)</span>
        </div>
        <div>
          <span className="text-slate-400 block font-medium">Quality Grade</span>
          <span className="font-bold text-slate-900 text-sm">{grade?.name}</span>
        </div>
        <div>
          <span className="text-slate-400 block font-medium">Selected Transport</span>
          <span className="font-bold text-slate-900 text-sm">{vehicle?.name}</span>
        </div>
      </div>

      {/* 2. Top Recommended Mandi Highlight Banner */}
      {topPick && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-agro-500/10 to-transparent border-2 border-emerald-600 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="bg-emerald-600 text-white text-[11px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
                🥇 AI Recommended Best Market
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                {topPick.mandi.name} ({topPick.mandi.district}, {topPick.mandi.state})
              </h3>
              <p className="text-xs text-slate-600">
                Distance: <strong>{topPick.distanceKm} km</strong> &bull; Travel Time: ~<strong>{topPick.travelTimeHours} hrs</strong> &bull; Spot Price: <strong>₹{topPick.rawSpotPrice}/qtl</strong>
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-200 text-right min-w-[200px]">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Estimated Net Return</span>
              <div className="text-3xl font-black text-emerald-700">
                ₹{topPick.estimatedNetReturn.toLocaleString('en-IN')}
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                ₹{topPick.effectiveRatePerQtl}/qtl Net Take-Home
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200 text-xs text-slate-700">
            <strong>AI Intelligence Summary:</strong> {topPick.aiRationale}
          </div>
        </div>
      )}

      {/* 3. Comprehensive Mandi Comparison Ledger Table (Step 3 & 5) */}
      <div className="space-y-3">
        <h4 className="font-bold text-slate-900 text-base">
          Mandi Comparison & Mathematical Deductions Ledger
        </h4>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200 text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Rank / Mandi</th>
                <th className="py-3 px-2">Distance</th>
                <th className="py-3 px-2">Spot Price</th>
                <th className="py-3 px-2">Gross Revenue</th>
                <th className="py-3 px-2 text-red-600">Transport</th>
                <th className="py-3 px-2 text-red-600">Mandi Fee</th>
                <th className="py-3 px-2 text-red-600">Hamali / Labor</th>
                <th className="py-3 px-3 text-emerald-700 font-black">Net Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {recommendations.slice(0, 5).map((item) => (
                <tr key={item.mandi.id} className={item.rank === 1 ? 'bg-emerald-50/70 font-semibold' : ''}>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold">{item.rankEmoji}</span>
                      <span className="font-bold text-slate-900">{item.mandi.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">{item.distanceKm} km</td>
                  <td className="py-3 px-2 font-mono font-medium">₹{item.rawSpotPrice}</td>
                  <td className="py-3 px-2 font-mono">₹{item.grossRevenue.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-2 font-mono text-red-600">-₹{item.transportCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-2 font-mono text-red-600">-₹{item.marketFee.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-2 font-mono text-red-600">-₹{item.handlingFee.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-800 text-sm">
                    ₹{item.estimatedNetReturn.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Active Order & Logistics Summary (If order was placed) */}
      {orderData && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 text-sm flex items-center">
            <Truck className="w-4 h-4 mr-1.5 text-agro-600" />
            Online Selling & Logistics Booking Summary
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <span className="text-slate-400 block">Order ID</span>
              <span className="font-bold text-slate-900">{orderData.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Buyer Name</span>
              <span className="font-bold text-slate-900">{orderData.buyer?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Assigned Driver</span>
              <span className="font-bold text-slate-900">{orderData.transporter?.driverName} ({orderData.transporter?.vehicleNo})</span>
            </div>
            <div>
              <span className="text-slate-400 block">Escrow OTP Code</span>
              <span className="font-mono font-black text-agro-800 text-sm">{orderData.otpCode}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Official Verification Stamp & Signature Footer */}
      <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-agro-600 flex items-center justify-center text-agro-700 font-bold text-[9px] uppercase text-center p-1 leading-tight">
            AGRO MARK AI
          </div>
          <div>
            <p className="font-bold text-slate-900">Agro Mark Verified Intelligence Dossier</p>
            <p className="text-slate-500">Autonomous Agricultural Optimization Protocol &bull; SIH-2026</p>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-400">
          <p>Electronically generated on {new Date().toISOString()}</p>
          <p>Authorized APMC Recommendation Certificate</p>
        </div>
      </div>
    </div>
  )
}
