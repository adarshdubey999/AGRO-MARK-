import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import HowItWorksPage from './pages/HowItWorksPage'
import RecommendationFlowPage from './pages/RecommendationFlowPage'
import OrdersTrackingPage from './pages/OrdersTrackingPage'
import SimulationPage from './pages/SimulationPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AuthPage from './pages/AuthPage'
import { Sprout, Heart } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-white font-black text-xl">
            <div className="w-8 h-8 rounded-lg bg-agro-600 flex items-center justify-center text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <span>Agro<span className="text-harvest-400">Mark</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-Based Personalized Agricultural Market Intelligence & Best-Market Recommendation System with Online Selling & Delivery Tracking.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-3">Farmer Intelligence</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/farmer/recommend" className="hover:text-agro-400 transition">Find Best Mandi (8-Step Flow)</Link></li>
            <li><Link to="/farmer/orders" className="hover:text-agro-400 transition">Online Selling & Live GPS</Link></li>
            <li><Link to="/farmer/simulation" className="hover:text-agro-400 transition">What-If Scenario Simulator</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-3">Platform & Admin</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/how-it-works" className="hover:text-agro-400 transition">How It Works (8 Stages)</Link></li>
            <li><Link to="/admin/dashboard" className="hover:text-indigo-400 transition">Admin Portal & APIs</Link></li>
            <li><Link to="/login" className="hover:text-agro-400 transition">Farmer & Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-3">SIH Hackathon Project</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Built with transparent mathematical Net Return formulas, Scikit-Learn price forecasting & Google Gemini AI guidance.
          </p>
          <div className="mt-3 text-[11px] text-agro-400 font-semibold flex items-center">
            <span>Compliant with Govt AGMARKNET data standards</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          &copy; {new Date().getFullYear()} Agro Mark. Dedicated to Indian Farmers & Agriculture.
        </div>
        <div className="text-[11px] text-slate-600">
          "Sell Smarter. Earn Better."
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [currentLang, setCurrentLang] = useState('en') // 'en' | 'hi' | 'mr'
  const [userRole, setUserRole] = useState('farmer') // 'farmer' | 'admin'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 antialiased selection:bg-agro-500 selection:text-white">
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        userRole={userRole}
        setUserRole={setUserRole}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/farmer/recommend" element={<RecommendationFlowPage currentLang={currentLang} />} />
          <Route path="/farmer/orders" element={<OrdersTrackingPage />} />
          <Route path="/farmer/simulation" element={<SimulationPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/login" element={<AuthPage userRole={userRole} setUserRole={setUserRole} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
