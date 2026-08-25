import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  User,
  ShieldCheck,
  Sprout,
  ArrowRight,
  CheckCircle2,
  Lock,
  Phone,
  Sparkles
} from 'lucide-react'

export default function AuthPage({ userRole, setUserRole }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('farmer') // 'farmer' | 'admin'
  const [phone, setPhone] = useState('+91 98765 43210')
  const [name, setName] = useState('Adarsh Dubey')
  const [password, setPassword] = useState('password123')
  const [adminUser, setAdminUser] = useState('admin')
  const [adminPass, setAdminPass] = useState('admin123')

  const handleFarmerLogin = (e) => {
    e.preventDefault()
    setUserRole('farmer')
    navigate('/farmer/recommend')
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    setUserRole('admin')
    navigate('/admin/dashboard')
  }

  const handleQuickDemoFarmer = () => {
    setUserRole('farmer')
    navigate('/farmer/recommend')
  }

  const handleQuickDemoAdmin = () => {
    setUserRole('admin')
    navigate('/admin/dashboard')
  }

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-agro-600 to-agro-800 flex items-center justify-center text-white mx-auto shadow-lg">
          <Sprout className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Access Agro Mark</h1>
        <p className="text-xs text-slate-500">Sign in to your personalized agricultural intelligence account.</p>
      </div>

      {/* Role Toggle Switch */}
      <div className="bg-slate-100 p-1 rounded-2xl grid grid-cols-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('farmer')}
          className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'farmer' ? 'bg-white text-agro-800 shadow-sm' : 'text-slate-500'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Farmer Portal</span>
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'admin' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
        {activeTab === 'farmer' ? (
          <form onSubmit={handleFarmerLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Farmer Full Name:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-agro-500 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Number (with OTP):</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-agro-500 font-mono font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-agro-600 hover:bg-agro-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Sign In as Farmer
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Admin Username:</label>
              <input
                type="text"
                required
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Sign In as Admin
            </button>
          </form>
        )}

        {/* Quick Demo Pre-fill Shortcuts */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            One-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoFarmer}
              className="p-2 bg-agro-50 hover:bg-agro-100 text-agro-800 rounded-xl text-[11px] font-bold transition text-center border border-agro-200"
            >
              🌾 Demo Farmer
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-[11px] font-bold transition text-center border border-indigo-200"
            >
              🛡️ Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
