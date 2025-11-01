'use client'

import { Shield, TrendingUp, AlertCircle } from 'lucide-react'

interface Analysis {
  totalValue: number
  totalCost: number
  gainLoss: number
  gainLossPercent: number
  diversification: string
  riskLevel: string
}

interface PortfolioItem {
  symbol: string
  shares: number
  avgPrice: number
}

export default function AnalysisPanel({
  analysis,
  portfolio
}: {
  analysis: Analysis
  portfolio: PortfolioItem[]
}) {
  const insights = [
    {
      icon: Shield,
      title: 'Diversification Score',
      description: `Your portfolio has ${analysis.diversification.toLowerCase()} diversification with ${portfolio.length} positions. ${
        analysis.diversification === 'Low'
          ? 'Consider adding more positions to reduce concentration risk.'
          : analysis.diversification === 'Medium'
          ? 'Decent spread, but could benefit from 2-3 additional positions.'
          : 'Well diversified across multiple positions.'
      }`,
      color: 'text-blue-400'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analysis',
      description: `Your portfolio is ${analysis.gainLoss >= 0 ? 'up' : 'down'} ${Math.abs(analysis.gainLossPercent).toFixed(2)}% overall. ${
        analysis.gainLossPercent > 15
          ? 'Strong performance! Consider taking some profits on winners.'
          : analysis.gainLossPercent > 0
          ? 'Positive returns. Continue monitoring your positions.'
          : 'Negative returns. Review fundamentals of underperforming positions.'
      }`,
      color: 'text-green-400'
    },
    {
      icon: AlertCircle,
      title: 'Risk Assessment',
      description: `Current risk level: ${analysis.riskLevel}. ${
        analysis.riskLevel === 'High'
          ? 'High volatility detected. Consider rebalancing to reduce exposure.'
          : analysis.riskLevel === 'Medium'
          ? 'Moderate risk profile. Maintain your risk management strategy.'
          : 'Low risk profile. You may be missing growth opportunities.'
      }`,
      color: 'text-yellow-400'
    }
  ]

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Detailed Analysis</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon className={`w-6 h-6 ${insight.color} flex-shrink-0 mt-1`} />
                <div>
                  <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                  <p className="text-sm text-purple-200">{insight.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
