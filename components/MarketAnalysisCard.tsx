import React, { useState } from 'react';
import { Card, Badge } from './ui';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target,
  Users,
  DollarSign,
  BarChart3,
  Eye,
  EyeOff,
  Lightbulb,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { MarketSizeAnalysis } from '../types';
import { formatCurrency, formatPercentage, getTrendImpactColor } from '../data/ecotrackMockData';

interface MarketAnalysisCardProps {
  market: MarketSizeAnalysis;
  onViewDetails?: (marketId: string) => void;
}

export default function MarketAnalysisCard({ market, onViewDetails }: MarketAnalysisCardProps) {
  const [showTrends, setShowTrends] = useState(false);
  const [showOpportunities, setShowOpportunities] = useState(false);
  const [showThreats, setShowThreats] = useState(false);

  const getTrendIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp size={14} className={getTrendImpactColor(impact as any)} />;
      case 'negative': return <TrendingDown size={14} className={getTrendImpactColor(impact as any)} />;
      case 'neutral': return <Minus size={14} className="text-slate-400" />;
    }
  };

  const getMarketSharePercentage = (obtainable: number, total: number) => {
    return ((obtainable / total) * 100).toFixed(1);
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 15) return 'text-green-400';
    if (growth >= 10) return 'text-blue-400';
    if (growth >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetails?.(market.id)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{market.industry}</h3>
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-indigo-400" />
            <span className="text-sm text-slate-400">Market Analysis</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Growth Rate</div>
          <div className={`text-xl font-bold ${getGrowthColor(market.growthRate)}`}>
            {formatPercentage(market.growthRate)}
          </div>
        </div>
      </div>

      {/* Market Size Breakdown */}
      <div className="mb-4">
        <div className="text-sm text-slate-400 mb-2">Market Size Breakdown</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Total Market (TAM)</span>
            <span className="text-sm font-medium text-white">{formatCurrency(market.totalMarketSize)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Addressable (SAM)</span>
            <span className="text-sm font-medium text-blue-400">{formatCurrency(market.addressableMarket)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Obtainable (SOM)</span>
            <span className="text-sm font-medium text-green-400">{formatCurrency(market.obtainableMarket)}</span>
          </div>
        </div>
      </div>

      {/* Market Share Visualization */}
      <div className="mb-4">
        <div className="text-sm text-slate-400 mb-2">Market Share Potential</div>
        <div className="relative">
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full" 
                 style={{ width: `${Math.min((market.obtainableMarket / market.totalMarketSize) * 100, 100)}%` }} />
          </div>
          <div className="text-xs text-slate-400 mt-1 text-center">
            {getMarketSharePercentage(market.obtainableMarket, market.totalMarketSize)}% of total market
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-slate-400" />
          <div>
            <div className="text-xs text-slate-400">Competitors</div>
            <div className="text-sm font-medium text-white">{market.competitorCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Target size={14} className="text-slate-400" />
          <div>
            <div className="text-xs text-slate-400">SOM Value</div>
            <div className="text-sm font-medium text-green-400">{formatCurrency(market.obtainableMarket)}</div>
          </div>
        </div>
      </div>

      {/* Market Trends Toggle */}
      <div className="mb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowTrends(!showTrends);
          }}
          className="flex items-center justify-between w-full text-sm text-slate-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            {showTrends ? <EyeOff size={14} /> : <Eye size={14} />}
            Market Trends ({market.marketTrends.length})
          </span>
        </button>

        {showTrends && (
          <div className="mt-3 space-y-2">
            {market.marketTrends.map((trend) => (
              <div key={trend.id} className="p-2 bg-slate-800/50 rounded-lg">
                <div className="flex items-start gap-2">
                  {getTrendIcon(trend.impact)}
                  <div className="flex-1">
                    <div className="text-xs font-medium text-white mb-1">{trend.title}</div>
                    <div className="text-xs text-slate-400 mb-1">{trend.description}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Confidence:</span>
                      <span className="text-white">{trend.confidence}%</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 capitalize">{trend.timeframe.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Opportunities & Threats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOpportunities(!showOpportunities);
            }}
            className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            <Lightbulb size={14} />
            Opportunities ({market.opportunities.length})
          </button>
          {showOpportunities && (
            <div className="mt-2 space-y-1">
              {market.opportunities.slice(0, 2).map((opp, index) => (
                <div key={index} className="text-xs text-slate-300 truncate">• {opp}</div>
              ))}
              {market.opportunities.length > 2 && (
                <div className="text-xs text-slate-500">+{market.opportunities.length - 2} more</div>
              )}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowThreats(!showThreats);
            }}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <AlertTriangle size={14} />
            Threats ({market.threats.length})
          </button>
          {showThreats && (
            <div className="mt-2 space-y-1">
              {market.threats.slice(0, 2).map((threat, index) => (
                <div key={index} className="text-xs text-slate-300 truncate">• {threat}</div>
              ))}
              {market.threats.length > 2 && (
                <div className="text-xs text-slate-500">+{market.threats.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>Updated {new Date(market.lastUpdated).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign size={12} />
          <span>{formatCurrency(market.obtainableMarket)} potential</span>
        </div>
      </div>
    </Card>
  );
}
