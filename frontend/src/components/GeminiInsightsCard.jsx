import React, { useState } from 'react'
import {
  Bot,
  Sparkles,
  Volume2,
  VolumeX,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Share2
} from 'lucide-react'

export default function GeminiInsightsCard({ recommendation, cropName, mandiName, currentLang = 'en' }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!recommendation) return null

  const handleToggleAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel()
        setIsPlayingAudio(false)
      } else {
        const textToRead = `${recommendation.aiRationale}. Optimal selling window is within 48 hours.`
        const utterance = new SpeechSynthesisUtterance(textToRead)
        utterance.rate = 0.95
        utterance.onend = () => setIsPlayingAudio(false)
        utterance.onerror = () => setIsPlayingAudio(false)
        window.speechSynthesis.speak(utterance)
        setIsPlayingAudio(true)
      }
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Agro Mark AI Advisory: ${recommendation.aiRationale} Expected Net Return: ₹${recommendation.estimatedNetReturn.toLocaleString('en-IN')}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gradient-to-br from-agro-900 via-agro-850 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-agro-700/50 relative overflow-hidden space-y-4">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-harvest-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-harvest-400 to-harvest-600 flex items-center justify-center text-slate-900 shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="font-bold text-sm text-white">Google Gemini AI Market Rationale</h4>
              <span className="bg-harvest-400/20 text-harvest-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-harvest-400/30">
                Live Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-300">Contextual decision breakdown for {cropName}</p>
          </div>
        </div>

        {/* Audio Speech & Share Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleAudio}
            className={`p-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
              isPlayingAudio ? 'bg-harvest-500 text-slate-900' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Read out AI Insights"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px]">{isPlayingAudio ? 'Stop' : 'Listen'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition text-xs flex items-center space-x-1"
            title="Copy Insights"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Core AI Explanation Quote */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 relative z-10">
        <p className="text-sm sm:text-base leading-relaxed text-slate-100 font-medium">
          &ldquo;{recommendation.aiRationale}&rdquo;
        </p>
      </div>

      {/* 4 Factor Key Takeaways */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 text-xs">
        <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-start space-x-2.5">
          <Lightbulb className="w-4 h-4 text-harvest-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Logistics Efficiency</span>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Distance ({recommendation.distanceKm} km) keeps round-trip freight within ₹{recommendation.transportCost.toLocaleString('en-IN')}.
            </p>
          </div>
        </div>

        <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-start space-x-2.5">
          <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Price Realization</span>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Realizing an effective rate of ₹{recommendation.effectiveRatePerQtl}/qtl after all mandi cess & handling.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
