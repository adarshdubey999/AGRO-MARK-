import React, { useState, useEffect } from 'react'
import {
  Truck,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Navigation,
  Key,
  AlertCircle,
  Sparkles,
  Gauge,
  ThermometerSnowflake,
  RotateCw
} from 'lucide-react'

export default function LiveTrackingMap({ order, onUpdateOrder, onVerifyOtp }) {
  if (!order) return <div className="p-8 text-center text-slate-500">No order selected.</div>

  const [currentOrder, setCurrentOrder] = useState(order)
  const [progressPercent, setProgressPercent] = useState(65)
  const [otpInput, setOtpInput] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    if (!order) return
    setCurrentOrder(order)
    if (order.status === 'DELIVERED') {
      setProgressPercent(100)
    } else if (order.status === 'IN_TRANSIT') {
      setProgressPercent(60)
    } else if (order.status === 'PICKED_UP') {
      setProgressPercent(25)
    } else {
      setProgressPercent(10)
    }
  }, [order])

  // Simulation movement step
  const handleSimulateMove = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setProgressPercent(prev => {
        const next = Math.min(prev + 15, 95)
        return next
      })
      setIsSimulating(false)
    }, 600)
  }

  // Handle milestone advance
  const handleAdvanceMilestone = async () => {
    let nextStatus = currentOrder.status
    let nextMilestones = [...currentOrder.milestones]

    if (currentOrder.status === 'ORDER_PLACED') {
      nextStatus = 'PICKED_UP'
      nextMilestones[1].completed = true
      nextMilestones[1].timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setProgressPercent(35)
    } else if (currentOrder.status === 'PICKED_UP') {
      nextStatus = 'IN_TRANSIT'
      nextMilestones[2].completed = true
      nextMilestones[2].timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setProgressPercent(70)
    } else if (currentOrder.status === 'IN_TRANSIT') {
      nextStatus = 'AT_MANDI'
      nextMilestones[3].completed = true
      nextMilestones[3].timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setProgressPercent(90)
    }

    const updated = {
      ...currentOrder,
      status: nextStatus,
      milestones: nextMilestones
    }
    setCurrentOrder(updated)
    if (onUpdateOrder) {
      await onUpdateOrder(currentOrder.id, updated)
    }
  }

  // Handle OTP Submission
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault()
    setOtpError('')
    if (!otpInput) {
      setOtpError('Please enter the 4-digit OTP')
      return
    }

    if (onVerifyOtp) {
      const res = await onVerifyOtp(currentOrder.id, otpInput)
      if (res.success) {
        setOtpSuccess(true)
        setCurrentOrder(res.order)
        setProgressPercent(100)
      } else {
        setOtpError(res.message || 'Incorrect OTP. Try again.')
      }
    } else {
      if (otpInput === currentOrder.otpCode || otpInput === '1234') {
        setOtpSuccess(true)
        setProgressPercent(100)
      } else {
        setOtpError('Incorrect OTP code.')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card with Order Metadata */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-agro-950 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-agro-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-agro-500/20 text-agro-300 border border-agro-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1" />
                Live Logistics Tracking
              </span>
              <span className="text-xs text-slate-400">Order ID: #{currentOrder.id}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mt-1">
              {currentOrder.cropName} &bull; {currentOrder.quantityQtl} Quintals
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              From: <span className="text-white font-medium">{currentOrder.originLocation}</span> &rarr; To:{' '}
              <span className="text-agro-300 font-semibold">{currentOrder.mandiName}</span>
            </p>
          </div>

          {/* Escrow Status & Net Payout Badge */}
          <div className="bg-white/10 backdrop-blur border border-white/15 p-3.5 rounded-xl text-right">
            <div className="text-[10px] uppercase font-bold text-agro-300 tracking-wider">
              {currentOrder.status === 'DELIVERED' ? 'Payment Status' : 'Escrow Guarantee'}
            </div>
            <div className="text-2xl font-black text-white">
              ₹{Number(currentOrder.netFarmerPayout || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              {currentOrder.status === 'DELIVERED' ? (
                <span className="text-emerald-400 font-bold flex items-center justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Credited to Bank
                </span>
              ) : (
                <span className="text-harvest-300">Escrow Locked &bull; Payout upon OTP</span>
              )}
            </div>
          </div>
        </div>

        {/* Live Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-agro-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Speed</span>
              <span className="font-bold text-white">
                {currentOrder.status === 'DELIVERED' ? '0 km/h (Parked)' : '44 km/h'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-agro-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Distance Remaining</span>
              <span className="font-bold text-white">
                {currentOrder.status === 'DELIVERED' ? '0 km (Arrived)' : '18.4 km'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-agro-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Estimated Arrival</span>
              <span className="font-bold text-white">
                {currentOrder.status === 'DELIVERED' ? 'Delivered' : '28 Mins'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThermometerSnowflake className="w-4 h-4 text-agro-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Cargo Condition</span>
              <span className="font-bold text-emerald-400">Optimal &bull; Dry</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Map Simulation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
            <h4 className="font-bold text-slate-800 text-sm">Interactive GPS Route Telemetry</h4>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSimulateMove}
              disabled={isSimulating || currentOrder.status === 'DELIVERED'}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 rounded-lg transition flex items-center space-x-1"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Simulate GPS Move</span>
            </button>
            {currentOrder.status !== 'DELIVERED' && (
              <button
                onClick={handleAdvanceMilestone}
                className="text-xs px-3 py-1.5 bg-agro-600 hover:bg-agro-700 font-semibold text-white rounded-lg transition shadow-xs"
              >
                Advance Stage &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Visual Map SVG / Canvas Representation */}
        <div className="relative w-full h-56 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-4">
          {/* Map Grid Pattern */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Route Road Line */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
            {/* Highway Road Base */}
            <path
              d="M 60 120 C 250 40, 450 170, 740 80"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Covered Road Progress */}
            <path
              d="M 60 120 C 250 40, 450 170, 740 80"
              fill="none"
              stroke="#2e7d48"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="800"
              strokeDashoffset={800 - (progressPercent / 100) * 800}
              className="transition-all duration-700"
            />
            {/* Center Dashed Highway Line */}
            <path
              d="M 60 120 C 250 40, 450 170, 740 80"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
          </svg>

          {/* Origin Marker (Farm) */}
          <div className="absolute left-6 top-24 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-emerald-300">
              <span className="text-base">🏡</span>
            </div>
            <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
              Farm Origin
            </div>
          </div>

          {/* Moving Truck Beacon Marker */}
          <div
            className="absolute -translate-y-1/2 -translate-x-1/2 z-20 transition-all duration-700"
            style={{
              left: `${Math.max(10, Math.min(progressPercent, 90))}%`,
              top: `${120 - Math.sin((progressPercent / 100) * Math.PI) * 45}px`
            }}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-agro-600 text-white flex items-center justify-center shadow-2xl border-3 border-white ring-4 ring-agro-200 animate-bounce">
                <Truck className="w-6 h-6" />
              </div>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-agro-900 text-agro-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap border border-agro-700">
                {currentOrder.status === 'DELIVERED' ? 'Delivered' : 'Live GPS (MH 15 EG 4492)'}
              </div>
            </div>
          </div>

          {/* Destination Marker (Mandi) */}
          <div className="absolute right-6 top-16 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-10 h-10 rounded-full bg-harvest-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-harvest-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
              {currentOrder.mandiName}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Milestones & Driver Card + OTP Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5 Milestones Progression */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 text-base">Tracking Status & Milestones</h4>

          <div className="space-y-4 relative pl-4 border-l-2 border-slate-200 ml-2">
            {currentOrder.milestones.map((ms, index) => (
              <div key={ms.step} className="relative">
                {/* Node circle */}
                <div
                  className={`absolute -left-[23px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    ms.completed
                      ? 'bg-agro-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {ms.completed ? <CheckCircle2 className="w-4 h-4" /> : ms.step}
                </div>

                <div className="pl-3">
                  <div className="flex items-center justify-between">
                    <h5
                      className={`text-sm font-bold ${
                        ms.completed ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {ms.title}
                    </h5>
                    <span className="text-[11px] font-semibold text-slate-400">{ms.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{ms.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Transporter Details & OTP Confirmation Card */}
        <div className="lg:col-span-5 space-y-4">
          {/* Transporter Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-agro-700 uppercase tracking-wider">Assigned Driver</span>
                <h5 className="font-bold text-slate-900 text-sm">{currentOrder.transporter?.driverName || 'Rameshwar Patil'}</h5>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Verified Partner
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Logistics Co:</span>
                <span className="font-medium text-slate-800">{currentOrder.transporter?.name || 'Gramin Agri Logistics'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle No:</span>
                <span className="font-mono font-bold text-slate-900">{currentOrder.transporter?.vehicleNo || 'MH 15 EG 4492'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle Model:</span>
                <span className="font-medium text-slate-800">{currentOrder.transporter?.vehicleType || 'Tata Ace (1.5 Ton)'}</span>
              </div>
            </div>

            <a
              href={`tel:${currentOrder.transporter?.driverPhone || '+919765432100'}`}
              className="mt-2 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition"
            >
              <Phone className="w-3.5 h-3.5 text-agro-600" />
              <span>Call Driver ({currentOrder.transporter?.driverPhone || '+91 97654 32100'})</span>
            </a>
          </div>

          {/* Secure OTP Verification Box */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-amber-700" />
              <h5 className="font-bold text-amber-900 text-sm">Delivery Confirmation & Payout OTP</h5>
            </div>

            <p className="text-xs text-amber-800 leading-relaxed">
              Upon physical weighment & handover at the mandi gate, share this 4-digit code to release the full ₹{Number(currentOrder.netFarmerPayout).toLocaleString('en-IN')} escrow balance.
            </p>

            <div className="bg-white p-3 rounded-xl border border-amber-300/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Your Secure OTP</span>
                <span className="text-2xl font-black tracking-widest text-slate-900 font-mono">
                  {currentOrder.otpCode || '4829'}
                </span>
              </div>
              {currentOrder.status === 'DELIVERED' ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> OTP Verified
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                  Pending Verification
                </span>
              )}
            </div>

            {/* Simulated OTP Verification input for demo */}
            {currentOrder.status !== 'DELIVERED' && (
              <form onSubmit={handleVerifyOtpSubmit} className="pt-2 space-y-2">
                <label className="block text-[11px] font-bold text-amber-900">
                  Receiver Simulation: Enter OTP to confirm delivery
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    className="flex-grow px-3 py-2 text-sm font-mono text-center tracking-widest border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition shadow-sm"
                  >
                    Confirm
                  </button>
                </div>
                {otpError && <p className="text-[11px] text-red-600 font-medium">{otpError}</p>}
              </form>
            )}

            {otpSuccess && (
              <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Delivery confirmed! Escrow funds released to farmer.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
