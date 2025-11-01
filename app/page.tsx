'use client'

import { useState } from 'react'
import { TrendingUp, Brain, DollarSign, PieChart, AlertTriangle, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import PortfolioChart from './components/PortfolioChart'
import RecommendationCard from './components/RecommendationCard'
import AnalysisPanel from './components/AnalysisPanel'

interface PortfolioItem {
  symbol: string
  shares: number
  avgPrice: number
}

interface Analysis {
  totalValue: number
  totalCost: number
  gainLoss: number
  gainLossPercent: number
  diversification: string
  riskLevel: string
  recommendations: Array<{
    type: 'buy' | 'sell' | 'hold' | 'warning'
    symbol: string
    action: string
    reason: string
    priority: 'high' | 'medium' | 'low'
  }>
  allocation: Array<{
    name: string
    value: number
    percentage: number
  }>
}

const mockPrices: { [key: string]: number } = {
  'AAPL': 178.50,
  'GOOGL': 142.30,
  'MSFT': 415.20,
  'TSLA': 242.80,
  'AMZN': 175.40,
  'NVDA': 495.60,
  'META': 485.30,
  'NFLX': 485.90,
  'AMD': 163.20,
  'INTC': 43.80,
  'SPY': 548.20,
  'QQQ': 475.30,
}

export default function Home() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [symbol, setSymbol] = useState('')
  const [shares, setShares] = useState('')
  const [avgPrice, setAvgPrice] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const addToPortfolio = () => {
    if (symbol && shares && avgPrice) {
      setPortfolio([...portfolio, {
        symbol: symbol.toUpperCase(),
        shares: parseFloat(shares),
        avgPrice: parseFloat(avgPrice)
      }])
      setSymbol('')
      setShares('')
      setAvgPrice('')
    }
  }

  const removeFromPortfolio = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index))
  }

  const analyzePortfolio = async () => {
    if (portfolio.length === 0) return

    setIsAnalyzing(true)

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    let totalValue = 0
    let totalCost = 0
    const allocation: { [key: string]: number } = {}

    portfolio.forEach(item => {
      const currentPrice = mockPrices[item.symbol] || item.avgPrice
      const value = item.shares * currentPrice
      const cost = item.shares * item.avgPrice

      totalValue += value
      totalCost += cost
      allocation[item.symbol] = value
    })

    const gainLoss = totalValue - totalCost
    const gainLossPercent = (gainLoss / totalCost) * 100

    // Generate AI recommendations
    const recommendations: Array<{
      type: 'buy' | 'sell' | 'hold' | 'warning'
      symbol: string
      action: string
      reason: string
      priority: 'high' | 'medium' | 'low'
    }> = portfolio.map(item => {
      const currentPrice = mockPrices[item.symbol] || item.avgPrice
      const change = ((currentPrice - item.avgPrice) / item.avgPrice) * 100

      if (change > 30) {
        return {
          type: 'sell' as const,
          symbol: item.symbol,
          action: 'Consider taking profits',
          reason: `${item.symbol} is up ${change.toFixed(1)}% from your entry. Consider selling 25-50% to lock in gains.`,
          priority: 'high' as const
        }
      } else if (change < -15) {
        return {
          type: 'warning' as const,
          symbol: item.symbol,
          action: 'Review position',
          reason: `${item.symbol} is down ${Math.abs(change).toFixed(1)}%. Reassess fundamentals before averaging down.`,
          priority: 'medium' as const
        }
      } else if (change > 10 && change < 20) {
        return {
          type: 'hold' as const,
          symbol: item.symbol,
          action: 'Hold current position',
          reason: `${item.symbol} showing healthy growth of ${change.toFixed(1)}%. Maintain position.`,
          priority: 'low' as const
        }
      } else {
        return {
          type: 'buy' as const,
          symbol: item.symbol,
          action: 'Consider averaging up',
          reason: `${item.symbol} showing moderate growth. Consider adding to position on dips.`,
          priority: 'low' as const
        }
      }
    })

    // Add diversification recommendation
    if (portfolio.length < 5) {
      recommendations.push({
        type: 'buy' as const,
        symbol: 'PORTFOLIO',
        action: 'Increase diversification',
        reason: 'Consider adding more positions to reduce concentration risk. Target 8-12 positions.',
        priority: 'high' as const
      })
    }

    const allocationArray = Object.entries(allocation).map(([name, value]) => ({
      name,
      value,
      percentage: (value / totalValue) * 100
    }))

    const maxAllocation = Math.max(...allocationArray.map(a => a.percentage))
    const diversification = maxAllocation > 40 ? 'Low' : maxAllocation > 25 ? 'Medium' : 'High'
    const riskLevel = gainLossPercent > 20 ? 'High' : gainLossPercent > 0 ? 'Medium' : 'Low'

    setAnalysis({
      totalValue,
      totalCost,
      gainLoss,
      gainLossPercent,
      diversification,
      riskLevel,
      recommendations: recommendations.sort((a, b) => {
        const priority = { high: 3, medium: 2, low: 1 }
        return priority[b.priority] - priority[a.priority]
      }),
      allocation: allocationArray
    })

    setIsAnalyzing(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-purple-600 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Investment Agent</h1>
            <p className="text-purple-300">AI-Powered Portfolio Analysis & Recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Add Holdings
              </h2>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Symbol (e.g., AAPL)"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  placeholder="Shares"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  placeholder="Avg Price"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={addToPortfolio}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Add to Portfolio
                </button>
              </div>
            </div>

            {/* Current Holdings */}
            {portfolio.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Current Holdings</h3>
                <div className="space-y-2">
                  {portfolio.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                      <div>
                        <div className="text-white font-semibold">{item.symbol}</div>
                        <div className="text-sm text-purple-300">{item.shares} @ ${item.avgPrice}</div>
                      </div>
                      <button
                        onClick={() => removeFromPortfolio(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={analyzePortfolio}
                  disabled={isAnalyzing}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Analyze Portfolio
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Analysis Results */}
          <div className="lg:col-span-2 space-y-6">
            {analysis ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                    <div className="text-purple-300 text-sm mb-1">Total Value</div>
                    <div className="text-2xl font-bold text-white">${analysis.totalValue.toFixed(2)}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                    <div className="text-purple-300 text-sm mb-1">Gain/Loss</div>
                    <div className={`text-2xl font-bold flex items-center gap-1 ${analysis.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {analysis.gainLoss >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      ${Math.abs(analysis.gainLoss).toFixed(2)}
                    </div>
                    <div className={`text-sm ${analysis.gainLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {analysis.gainLossPercent >= 0 ? '+' : ''}{analysis.gainLossPercent.toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                    <div className="text-purple-300 text-sm mb-1">Diversification</div>
                    <div className="text-2xl font-bold text-white">{analysis.diversification}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                    <div className="text-purple-300 text-sm mb-1">Risk Level</div>
                    <div className="text-2xl font-bold text-white">{analysis.riskLevel}</div>
                  </div>
                </div>

                {/* Portfolio Chart */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Portfolio Allocation
                  </h3>
                  <PortfolioChart data={analysis.allocation} />
                </div>

                {/* AI Recommendations */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <RecommendationCard key={index} recommendation={rec} />
                    ))}
                  </div>
                </div>

                {/* Analysis Panel */}
                <AnalysisPanel analysis={analysis} portfolio={portfolio} />
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
                <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze</h3>
                <p className="text-purple-300">Add your holdings and click "Analyze Portfolio" to receive AI-powered insights and recommendations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
