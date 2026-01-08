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
  Calendar,
  ArrowUpRight
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
      case 'positive': return <TrendingUp size={16} className="text-emerald-500" />;
      case 'negative': return <TrendingDown size={16} className="text-rose-500" />;
      case 'neutral': return <Minus size={16} className="text-slate-400" />;
    }
  };

  const getMarketSharePercentage = (obtainable: number, total: number) => {
    return ((obtainable / total) * 100).toFixed(1);
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 15) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (growth >= 10) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    if (growth >= 5) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <Card className="hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer border-slate-200 shadow-sm bg-white rounded-3xl group" onClick={() => onViewDetails?.(market.id)}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{market.industry}</h3>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <BarChart3 size={16} className="text-indigo-500" />
            <span>Market Analysis</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Growth Rate</div>
          <div className={`text-sm font-bold px-2 py-1 rounded-lg border inline-flex items-center gap-1 ${getGrowthColor(market.growthRate)}`}>
            <TrendingUp size={14} />
            {formatPercentage(market.growthRate)}
          </div>
        </div>
      </div>

      {/* Market Size Breakdown */}
      <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Market Potential</div>
        <div className="space-y-3">
          <div className="flex justify-between items-center group/item hover:bg-white hover:shadow-sm p-2 rounded-xl transition-all">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Market (TAM)</span>
            <span className="text-sm font-bold text-slate-900">{formatCurrency(market.totalMarketSize)}</span>
          </div>
          <div className="flex justify-between items-center group/item hover:bg-white hover:shadow-sm p-2 rounded-xl transition-all">
            <span className="text-xs font-bold text-slate-500 uppercase">Addressable (SAM)</span>
            <span className="text-sm font-bold text-indigo-600">{formatCurrency(market.addressableMarket)}</span>
          </div>
          <div className="flex justify-between items-center group/item hover:bg-white hover:shadow-sm p-2 rounded-xl transition-all">
            <span className="text-xs font-bold text-slate-500 uppercase">Obtainable (SOM)</span>
            <span className="text-sm font-bold text-emerald-600">{formatCurrency(market.obtainableMarket)}</span>
          </div>
        </div>
      </div>

      {/* Market Share Visualization */}
      <div className="mb-6 px-2">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span>Market Penetration</span>
          <span>{getMarketSharePercentage(market.obtainableMarket, market.totalMarketSize)}%</span>
        </div>
        <div className="relative">
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-3 rounded-full shadow-sm"
              style={{ width: `${Math.min((market.obtainableMarket / market.totalMarketSize) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
            <Users size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Competitors</div>
            <div className="text-sm font-bold text-slate-900">{market.competitorCount} Active</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white">
          <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
            <Target size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">SOM Value</div>
            <div className="text-sm font-bold text-emerald-700">{formatCurrency(market.obtainableMarket)}</div>
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
          className="flex items-center justify-between w-full text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors group"
        >
          <span className="flex items-center gap-2">
            {showTrends ? <EyeOff size={16} /> : <Eye size={16} />}
            Market Trends
          </span>
          <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            {market.marketTrends.length} Detected
          </span>
        </button>

        {showTrends && (
          <div className="mt-4 space-y-2 animate-in slide-in-from-top-2">
            {market.marketTrends.map((trend) => (
              <div key={trend.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 custom-icon-box">
                    {getTrendIcon(trend.impact)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900 mb-1">{trend.title}</div>
                    <div className="text-xs text-slate-500 mb-2 leading-relaxed">{trend.description}</div>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-slate-400 flex items-center gap-1">Confidence <span className="text-slate-700">{trend.confidence}%</span></span>
                      <span className="text-slate-300">•</span>
                      <span className="text-indigo-600">{trend.timeframe.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Opportunities & Threats */}
      <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-100">
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOpportunities(!showOpportunities);
            }}
            className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors mb-2"
          >
            <Lightbulb size={16} />
            Opportunities
          </button>

          <div className={`space-y-1 transition-all ${showOpportunities ? 'opacity-100' : 'opacity-70'}`}>
            {(showOpportunities ? market.opportunities : market.opportunities.slice(0, 1)).map((opp, index) => (
              <div key={index} className="text-xs text-slate-500 font-medium truncate flex items-center gap-1.5">
                <span className="w-1 h-1 bg-emerald-400 rounded-full"></span> {opp}
              </div>
            ))}
            {!showOpportunities && market.opportunities.length > 1 && (
              <div className="text-[10px] text-slate-400 font-bold pl-2.5">+{market.opportunities.length - 1} more</div>
            )}
          </div>

        </div>

        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowThreats(!showThreats);
            }}
            className="flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors mb-2"
          >
            <AlertTriangle size={16} />
            Threats
          </button>
          <div className={`space-y-1 transition-all ${showThreats ? 'opacity-100' : 'opacity-70'}`}>
            {(showThreats ? market.threats : market.threats.slice(0, 1)).map((threat, index) => (
              <div key={index} className="text-xs text-slate-500 font-medium truncate flex items-center gap-1.5">
                <span className="w-1 h-1 bg-rose-400 rounded-full"></span> {threat}
              </div>
            ))}
            {!showThreats && market.threats.length > 1 && (
              <div className="text-[10px] text-slate-400 font-bold pl-2.5">+{market.threats.length - 1} more</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
