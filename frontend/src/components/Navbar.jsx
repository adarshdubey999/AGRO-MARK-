import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sprout,
  TrendingUp,
  MapPin,
  Calculator,
  Bot,
  User,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  BarChart3,
  Truck,
  ShoppingBag,
  FileText,
  Sliders,
  Globe,
  CheckSquare
} from 'lucide-react'
import { TRANSLATIONS } from '../services/mockData'

export default function Navbar({ currentLang, setCurrentLang, userRole, setUserRole }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Farmer Portal', path: '/farmer', highlight: true },
    { name: '8-Step Mandi Flow', path: '/farmer/recommend' },
    { name: 'Mandatory Test Scenarios', path: '/test-scenarios', icon: CheckSquare },
    { name: 'Online Orders & Tracking', path: '/farmer/orders', icon: Truck },
    { name: 'What-If Simulator', path: '/farmer/simulation', icon: Sliders },
    { name: 'Admin Portal', path: '/admin/dashboard', isAdmin: true }
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agro-600 to-agro-800 flex items-center justify-center text-white shadow-md shadow-agro-600/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-agro-900">Agro<span className="text-harvest-600">Mark</span></span>
                <span className="bg-agro-100 text-agro-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-agro-200">AI</span>
              </div>
              <span className="block text-[9px] uppercase tracking-wider font-semibold text-agro-600">
                Market Intelligence & Logistics
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))
              const IconComp = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                    link.isAdmin
                      ? isActive
                        ? 'text-indigo-700 bg-indigo-50 font-bold'
                        : 'text-slate-600 hover:text-indigo-700 hover:bg-slate-50'
                      : link.highlight
                      ? isActive
                        ? 'text-agro-800 bg-agro-100 font-bold border border-agro-200'
                        : 'text-agro-700 hover:bg-agro-50 font-bold'
                      : isActive
                      ? 'text-agro-700 bg-agro-50 font-bold'
                      : 'text-slate-600 hover:text-agro-700 hover:bg-slate-50'
                  }`}
                >
                  {IconComp && <IconComp className="w-3.5 h-3.5 text-agro-600" />}
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Action Tools: Language, Role Switch, CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 mr-1 ml-1" />
              <button
                onClick={() => setCurrentLang('en')}
                className={`px-2 py-0.5 rounded font-medium text-xs transition ${currentLang === 'en' ? 'bg-white text-agro-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                EN
              </button>
              <button
                onClick={() => setCurrentLang('hi')}
                className={`px-2 py-0.5 rounded font-medium text-xs transition ${currentLang === 'hi' ? 'bg-white text-agro-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setCurrentLang('mr')}
                className={`px-2 py-0.5 rounded font-medium text-xs transition ${currentLang === 'mr' ? 'bg-white text-agro-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                मराठी
              </button>
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={() => setUserRole(userRole === 'farmer' ? 'admin' : 'farmer')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition flex items-center space-x-1.5 ${
                userRole === 'admin'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Toggle Farmer vs Admin Role"
            >
              {userRole === 'admin' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Admin Mode</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Farmer Mode</span>
                </>
              )}
            </button>

            {/* Launch Flow CTA */}
            <Link
              to="/farmer/recommend"
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-agro-600 hover:bg-agro-700 rounded-lg shadow-sm shadow-agro-600/20 transition-all"
            >
              <span>{t.findBestMarket}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-agro-50"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Language:</span>
            <div className="flex space-x-1">
              {['en', 'hi', 'mr'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCurrentLang(lang)}
                  className={`px-2 py-1 text-xs rounded uppercase font-bold ${currentLang === lang ? 'bg-agro-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
