'use client'

import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react'

interface Recommendation {
  type: 'buy' | 'sell' | 'hold' | 'warning'
  symbol: string
  action: string
  reason: string
  priority: 'high' | 'medium' | 'low'
}

const typeConfig = {
  buy: {
    icon: TrendingUp,
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    textColor: 'text-green-400',
  },
  sell: {
    icon: TrendingDown,
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/50',
    textColor: 'text-orange-400',
  },
  hold: {
    icon: Target,
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-400',
  },
}

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
}

export default function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const config = typeConfig[recommendation.type]
  const Icon = config.icon

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 ${config.bgColor} rounded-lg`}>
          <Icon className={`w-5 h-5 ${config.textColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{recommendation.symbol}</span>
            <span className={`px-2 py-0.5 ${priorityColors[recommendation.priority]} text-white text-xs rounded-full`}>
              {recommendation.priority}
            </span>
          </div>
          <div className={`font-medium ${config.textColor} mb-1`}>{recommendation.action}</div>
          <div className="text-sm text-purple-200">{recommendation.reason}</div>
        </div>
      </div>
    </div>
  )
}
