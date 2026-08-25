import React from 'react'
import {
  Sprout,
  MapPin,
  Scale,
  Cpu,
  Trophy,
  ShoppingCart,
  Truck,
  FileSpreadsheet,
  Check
} from 'lucide-react'

export const STEPS = [
  { id: 1, title: 'Crop Selection', subtitle: 'Variety & Quality', icon: Sprout },
  { id: 2, title: 'Location', subtitle: 'Nearby & Transport', icon: MapPin },
  { id: 3, title: 'Mandi Comparison', subtitle: 'Raw APMC Data', icon: Scale },
  { id: 4, title: 'AI Analysis', subtitle: 'Multi-Factor Model', icon: Cpu },
  { id: 5, title: 'Best Market', subtitle: 'Net Return Ranked', icon: Trophy },
  { id: 6, title: 'Online Selling', subtitle: 'Lock Deal & Escrow', icon: ShoppingCart },
  { id: 7, title: 'Delivery Tracking', subtitle: 'Live GPS & OTP', icon: Truck },
  { id: 8, title: 'Farmer Report', subtitle: 'Dossier & Analytics', icon: FileSpreadsheet }
]

export default function StepProgressBar({ currentStep, onStepClick }) {
  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 mb-8">
      {/* Step Numbers & Connection Track */}
      <div className="relative">
        {/* Continuous Track Background */}
        <div className="hidden lg:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
        <div
          className="hidden lg:block absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-agro-500 transition-all duration-500 -z-0"
          style={{ width: `${Math.min(100, ((currentStep - 1) / (STEPS.length - 1)) * 100)}%` }}
        />

        {/* Step Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 relative z-10">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep
            const isPending = step.id > currentStep
            const Icon = step.icon

            return (
              <button
                key={step.id}
                onClick={() => onStepClick && onStepClick(step.id)}
                disabled={!onStepClick || (isPending && step.id > currentStep + 1)}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-agro-50/90 ring-2 ring-agro-500 shadow-sm'
                    : isCompleted
                    ? 'hover:bg-slate-50 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Step Circle Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-agro-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-gradient-to-br from-agro-600 to-harvest-600 text-white ring-4 ring-agro-100 shadow-md animate-pulse'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
                </div>

                {/* Step Text Info */}
                <div className="mt-2">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-[10px] font-bold text-slate-400">Step {step.id}</span>
                  </div>
                  <p
                    className={`text-xs font-bold leading-tight mt-0.5 ${
                      isCurrent ? 'text-agro-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[10px] text-slate-400 hidden sm:block truncate max-w-[90px]">{step.subtitle}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
