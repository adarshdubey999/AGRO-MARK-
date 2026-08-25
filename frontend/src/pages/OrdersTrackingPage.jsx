import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Search,
  ArrowRight,
  Eye,
  Plus,
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import LiveTrackingMap from '../components/LiveTrackingMap'
import { apiService } from '../services/api'

export default function OrdersTrackingPage() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'ACTIVE' | 'DELIVERED'
  const [searchTerm, setSearchTerm] = useState('')

  const fetchOrders = async () => {
    const data = await apiService.getOrders()
    setOrders(data)
    if (data.length > 0 && !selectedOrder) {
      setSelectedOrder(data[0])
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.mandiName.toLowerCase().includes(searchTerm.toLowerCase())
    if (statusFilter === 'ACTIVE') {
      return matchesSearch && ord.status !== 'DELIVERED'
    } else if (statusFilter === 'DELIVERED') {
      return matchesSearch && ord.status === 'DELIVERED'
    }
    return matchesSearch
  })

  // Total summary metrics
  const totalVolume = orders.reduce((sum, o) => sum + (o.quantityQtl || 0), 0)
  const totalEarnings = orders.reduce((sum, o) => sum + (o.netFarmerPayout || 0), 0)
  const activeShipments = orders.filter(o => o.status !== 'DELIVERED').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-agro-700 uppercase tracking-wider">Farmer Hub</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Online Orders & Live Delivery Tracking</h1>
          <p className="text-sm text-slate-500">Monitor active truck dispatches, escrow payouts, and verify delivery OTPs.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchOrders}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition text-xs font-bold flex items-center space-x-1"
            title="Refresh Orders"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            to="/farmer/recommend"
            className="inline-flex items-center px-4 py-2.5 bg-agro-600 hover:bg-agro-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>New Crop Listing</span>
          </Link>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Active In-Transit Shipments</span>
            <div className="text-2xl font-black text-agro-800 mt-1">{activeShipments} Trucks Active</div>
          </div>
          <div className="w-12 h-12 bg-agro-100 text-agro-700 rounded-2xl flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Total Harvest Traded</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalVolume} Quintals</div>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
            <span className="text-xl">🌾</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Total Net Earnings</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">₹{totalEarnings.toLocaleString('en-IN')}</div>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Orders List & Active Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Orders List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {['ALL', 'ACTIVE', 'DELIVERED'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    statusFilter === f ? 'bg-white text-agro-800 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-3 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-agro-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No orders match your filter.
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id
                return (
                  <button
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`w-full p-4 rounded-2xl border text-left transition relative ${
                      isSelected
                        ? 'border-2 border-agro-600 bg-agro-50/80 shadow-md ring-2 ring-agro-100'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 font-mono">#{ord.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-harvest-100 text-harvest-800 animate-pulse'
                        }`}
                      >
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-1">
                      {ord.cropName} &bull; {ord.quantityQtl} Qtl
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">To: {ord.mandiName}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Net Payout:</span>
                      <span className="font-black text-agro-800">
                        ₹{Number(ord.netFarmerPayout).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right: Selected Order Live Tracking Detail */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <LiveTrackingMap
              order={selectedOrder}
              onUpdateOrder={async (id, data) => {
                await apiService.updateOrderStatus(id, data)
                fetchOrders()
              }}
              onVerifyOtp={async (id, otp) => {
                const res = await apiService.verifyDeliveryOtp(id, otp)
                if (res.success) {
                  fetchOrders()
                }
                return res
              }}
            />
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500">
              Select an order from the list to view real-time tracking telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
