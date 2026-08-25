import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Users,
  Sprout,
  Store,
  Tag,
  BarChart3,
  Database,
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Trash2,
  Search,
  DollarSign
} from 'lucide-react'
import { CROPS, MANDIS, DEMO_ORDERS } from '../services/mockData'
import { apiService } from '../services/api'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('crops') // 'farmers' | 'crops' | 'mandis' | 'prices' | 'reports' | 'data'

  // Admin Data states
  const [cropsList, setCropsList] = useState(CROPS)
  const [mandisList, setMandisList] = useState(MANDIS)
  const [ordersList, setOrdersList] = useState(DEMO_ORDERS)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('')

  // New Crop Form Modal State
  const [showAddCropModal, setShowAddCropModal] = useState(false)
  const [newCrop, setNewCrop] = useState({
    id: '',
    name: '',
    hindiName: '',
    category: 'Vegetable',
    icon: '🌱',
    basePrice: 2000,
    msp: 1800,
    varieties: 'Hybrid, Local Desi'
  })

  // New Mandi Form State
  const [showAddMandiModal, setShowAddMandiModal] = useState(false)
  const [newMandi, setNewMandi] = useState({
    id: '',
    name: '',
    district: '',
    state: 'Maharashtra',
    lat: 19.8,
    lng: 74.5,
    transportRatePerKm: 13.0,
    marketFeePercent: 1.0,
    handlingFeePerQtl: 20.0,
    avgDailyArrivals: 3000
  })

  // API Sync Simulation State
  const [isSyncingApi, setIsSyncingApi] = useState(false)
  const [syncStatus, setSyncStatus] = useState('Agmarknet National API Feed: Active (Synced 10m ago)')

  const triggerSaveNotification = (msg) => {
    setSaveSuccessMsg(msg)
    setTimeout(() => setSaveSuccessMsg(''), 3000)
  }

  // Handle Add Crop
  const handleAddCropSubmit = async (e) => {
    e.preventDefault()
    if (!newCrop.name || !newCrop.id) return

    const cropObj = {
      ...newCrop,
      basePrice: Number(newCrop.basePrice),
      msp: Number(newCrop.msp),
      varieties: typeof newCrop.varieties === 'string' ? newCrop.varieties.split(',').map(v => v.trim()) : newCrop.varieties
    }

    await apiService.adminSaveCrop(cropObj)
    setCropsList([cropObj, ...cropsList])
    setShowAddCropModal(false)
    triggerSaveNotification(`Successfully added crop ${cropObj.name}!`)
  }

  // Handle Add Mandi
  const handleAddMandiSubmit = async (e) => {
    e.preventDefault()
    if (!newMandi.name || !newMandi.id) return

    const mandiObj = {
      ...newMandi,
      lat: Number(newMandi.lat),
      lng: Number(newMandi.lng),
      transportRatePerKm: Number(newMandi.transportRatePerKm),
      marketFeePercent: Number(newMandi.marketFeePercent),
      handlingFeePerQtl: Number(newMandi.handlingFeePerQtl),
      avgDailyArrivals: Number(newMandi.avgDailyArrivals)
    }

    await apiService.adminSaveMandi(mandiObj)
    setMandisList([mandiObj, ...mandisList])
    setShowAddMandiModal(false)
    triggerSaveNotification(`Successfully registered mandi ${mandiObj.name}!`)
  }

  // Handle Price Change
  const handlePriceUpdate = (cropId, newPrice) => {
    const updated = cropsList.map(c => c.id === cropId ? { ...c, basePrice: Number(newPrice) } : c)
    setCropsList(updated)
    triggerSaveNotification(`Updated spot base price to ₹${newPrice}/qtl`)
  }

  // Simulate API Sync
  const handleSimulateSync = () => {
    setIsSyncingApi(true)
    setTimeout(() => {
      setIsSyncingApi(false)
      setSyncStatus(`Agmarknet National API Feed: Synced Just Now (${new Date().toLocaleTimeString()})`)
      triggerSaveNotification('Live Agmarknet & APMC Price Feeds successfully refreshed!')
    }, 1200)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Administrative Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">Agro Mark Admin Portal</h1>
          <p className="text-xs text-indigo-200 mt-1">
            Manage Registered Farmers, APMC Mandis, Commodities, Live Agmarknet Price Feeds & System Intelligence.
          </p>
        </div>

        {saveSuccessMsg && (
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto text-xs font-bold space-x-1">
        {[
          { id: 'crops', name: 'Manage Crops & Varieties', icon: Sprout },
          { id: 'mandis', name: 'Manage APMC Mandis', icon: Store },
          { id: 'prices', name: 'Live Price Feeds', icon: Tag },
          { id: 'farmers', name: 'Farmers & Orders', icon: Users },
          { id: 'reports', name: 'System Reports & KPIs', icon: BarChart3 },
          { id: 'data', name: 'Data & API Management', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-2 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-indigo-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: MANAGE CROPS */}
      {activeTab === 'crops' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Crop & Variety Master Catalog</h3>
              <p className="text-xs text-slate-500">Configure base spot prices, MSP rates, and recognized varieties.</p>
            </div>
            <button
              onClick={() => setShowAddCropModal(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Add New Crop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cropsList.map((crop) => (
              <div key={crop.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{crop.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {crop.category}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{crop.name}</h4>
                  <p className="text-xs text-slate-500">{crop.hindiName}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base Price:</span>
                    <span className="font-bold text-indigo-700 font-mono">₹{crop.basePrice}/q</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Govt MSP:</span>
                    <span className="font-medium text-slate-700 font-mono">₹{crop.msp || 'N/A'}/q</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate pt-1">
                    Varieties: {Array.isArray(crop.varieties) ? crop.varieties.join(', ') : crop.varieties}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE MANDIS */}
      {activeTab === 'mandis' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">APMC Mandi Registry</h3>
              <p className="text-xs text-slate-500">Configure market cess %, handling fees, and GPS coordinates.</p>
            </div>
            <button
              onClick={() => setShowAddMandiModal(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Register APMC Mandi</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Mandi Name</th>
                  <th className="py-3 px-3">District & State</th>
                  <th className="py-3 px-3">Cess %</th>
                  <th className="py-3 px-3">Handling Fee</th>
                  <th className="py-3 px-3">Freight Base</th>
                  <th className="py-3 px-3">Avg Arrivals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mandisList.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{m.name}</td>
                    <td className="py-3 px-3">{m.district}, {m.state}</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">{m.marketFeePercent}%</td>
                    <td className="py-3 px-3 font-mono">₹{m.handlingFeePerQtl}/q</td>
                    <td className="py-3 px-3 font-mono">₹{m.transportRatePerKm}/km</td>
                    <td className="py-3 px-3">{m.avgDailyArrivals.toLocaleString('en-IN')} Qtl/day</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE PRICE FEEDS */}
      {activeTab === 'prices' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Live Spot Rates & Feeds Editor</h3>
              <p className="text-xs text-slate-500">Simulate market price shifts to test transparent recommendation adjustments.</p>
            </div>
            <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold">
              Live Feed Active
            </div>
          </div>

          <div className="space-y-3">
            {cropsList.map((crop) => (
              <div key={crop.id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{crop.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{crop.name}</h4>
                    <p className="text-xs text-slate-500">{crop.category} &bull; MSP: ₹{crop.msp || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-xs text-slate-500 font-bold">Base Price (₹/q):</label>
                  <input
                    type="number"
                    value={crop.basePrice}
                    onChange={(e) => handlePriceUpdate(crop.id, e.target.value)}
                    className="w-28 px-3 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-lg text-right focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FARMERS & ORDERS */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Registered Farmers & Order Escrows</h3>
              <p className="text-xs text-slate-500">Monitor active farmer registrations and digital escrow release statuses.</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-3">Farmer Name</th>
                  <th className="py-3 px-3">Crop & Quantity</th>
                  <th className="py-3 px-3">Destination Mandi</th>
                  <th className="py-3 px-3">Net Payout</th>
                  <th className="py-3 px-3">Escrow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {ordersList.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{ord.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{ord.farmerName}</div>
                      <div className="text-[10px] text-slate-400">{ord.farmerPhone}</div>
                    </td>
                    <td className="py-3 px-3">{ord.cropName} &bull; {ord.quantityQtl} Qtl</td>
                    <td className="py-3 px-3">{ord.mandiName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                      ₹{Number(ord.netFarmerPayout).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {ord.escrowStatus || 'ESCROW_LOCKED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">System Intelligence & Trade Metrics</h3>
              <p className="text-xs text-slate-500">Aggregated performance impact across all registered agricultural markets.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-indigo-50/60 rounded-2xl border border-indigo-100">
              <span className="text-xs font-bold text-indigo-900 uppercase">Average Farmer Margin Boost</span>
              <div className="text-3xl font-black text-indigo-700 mt-1">+14.2%</div>
              <p className="text-[11px] text-indigo-800 mt-1">vs blind local selling without net-return calculation</p>
            </div>
            <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-900 uppercase">Total Escrow Processed</span>
              <div className="text-3xl font-black text-emerald-700 mt-1">₹4.82 Cr</div>
              <p className="text-[11px] text-emerald-800 mt-1">100% dispute-free OTP settlement</p>
            </div>
            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-100">
              <span className="text-xs font-bold text-amber-900 uppercase">Top Commodity Traded</span>
              <div className="text-3xl font-black text-amber-700 mt-1">Onion (Nashik Red)</div>
              <p className="text-[11px] text-amber-800 mt-1">32,400 Qtl optimized this season</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DATA & API MANAGEMENT */}
      {activeTab === 'data' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">National Agmarknet API & Data Management</h3>
              <p className="text-xs text-slate-500">Configure simulated Agmarknet API feeds and AI scoring hyperparameters.</p>
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">AGMARKNET Data Pipeline Synchronizer</h4>
                <p className="text-xs text-slate-500">{syncStatus}</p>
              </div>
              <button
                onClick={handleSimulateSync}
                disabled={isSyncingApi}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isSyncingApi ? 'animate-spin' : ''}`} />
                <span>{isSyncingApi ? 'Syncing...' : 'Sync Live Data'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddCropModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Commodity</h3>
            <form onSubmit={handleAddCropSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Crop ID (lowercase e.g. turmeric):</label>
                <input
                  type="text"
                  required
                  value={newCrop.id}
                  onChange={(e) => setNewCrop({ ...newCrop, id: e.target.value.toLowerCase().trim() })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="turmeric"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Crop Name (English):</label>
                <input
                  type="text"
                  required
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Turmeric"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hindi / Regional Name:</label>
                <input
                  type="text"
                  value={newCrop.hindiName}
                  onChange={(e) => setNewCrop({ ...newCrop, hindiName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="हल्दी"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Price (₹/q):</label>
                  <input
                    type="number"
                    value={newCrop.basePrice}
                    onChange={(e) => setNewCrop({ ...newCrop, basePrice: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">MSP (₹/q):</label>
                  <input
                    type="number"
                    value={newCrop.msp}
                    onChange={(e) => setNewCrop({ ...newCrop, msp: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Varieties (comma separated):</label>
                <input
                  type="text"
                  value={newCrop.varieties}
                  onChange={(e) => setNewCrop({ ...newCrop, varieties: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Salem, Waigaon, Rajapore"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCropModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Save Commodity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Mandi Modal */}
      {showAddMandiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Register New APMC Mandi</h3>
            <form onSubmit={handleAddMandiSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mandi ID:</label>
                <input
                  type="text"
                  required
                  value={newMandi.id}
                  onChange={(e) => setNewMandi({ ...newMandi, id: e.target.value.toLowerCase().trim() })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="mandi-aurangabad"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mandi Name:</label>
                <input
                  type="text"
                  required
                  value={newMandi.name}
                  onChange={(e) => setNewMandi({ ...newMandi, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Aurangabad APMC (Jadhavwadi)"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District:</label>
                  <input
                    type="text"
                    required
                    value={newMandi.district}
                    onChange={(e) => setNewMandi({ ...newMandi, district: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="Chhatrapati Sambhajinagar"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State:</label>
                  <input
                    type="text"
                    required
                    value={newMandi.state}
                    onChange={(e) => setNewMandi({ ...newMandi, state: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="Maharashtra"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">APMC Cess (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMandi.marketFeePercent}
                    onChange={(e) => setNewMandi({ ...newMandi, marketFeePercent: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Handling (₹/q):</label>
                  <input
                    type="number"
                    value={newMandi.handlingFeePerQtl}
                    onChange={(e) => setNewMandi({ ...newMandi, handlingFeePerQtl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMandiModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Register Mandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
