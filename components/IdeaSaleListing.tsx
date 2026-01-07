import React, { useState } from 'react';
import { Card, Badge, Button } from './ui';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Eye, 
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Target,
  Lightbulb,
  Package
} from 'lucide-react';
import { StartupIdea } from '../types';
import { IdeaValuationService } from '../services/ideaValuation';

interface IdeaSaleListingProps {
  idea: StartupIdea;
  onViewDetails?: (ideaId: string) => void;
  onContact?: (ideaId: string) => void;
}

export default function IdeaSaleListing({ idea, onViewDetails, onContact }: IdeaSaleListingProps) {
  const [showFinancialBreakdown, setShowFinancialBreakdown] = useState(false);

  const getStatusColor = (status: StartupIdea['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'sold': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'withdrawn': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getProfitMarginColor = (margin: number) => {
    if (margin > 20) return 'text-green-400';
    if (margin > 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const profitMargin = idea.monthlyRevenue > 0 
    ? ((idea.monthlyRevenue - idea.monthlyExpenses) / idea.monthlyRevenue) * 100 
    : 0;

  return (
    <Card className="group relative overflow-hidden">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={getStatusColor(idea.status)}>
          {idea.status.toUpperCase()}
        </Badge>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2 pr-20">{idea.title}</h3>
        <p className="text-slate-300 text-sm line-clamp-3 mb-3">{idea.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Target size={14} className="text-indigo-400" />
            {idea.industry}
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} className="text-indigo-400" />
            {idea.founderName}
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Asking Price</div>
          <div className="text-lg font-bold text-green-400">
            {formatCurrency(idea.saleTerms.askingPrice)}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Est. Value</div>
          <div className="text-lg font-bold text-blue-400">
            {formatCurrency(idea.valuation.estimated)}
          </div>
        </div>
      </div>

      {/* Business Metrics */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Monthly Revenue</span>
          <span className="text-sm font-medium text-white">
            {formatCurrency(idea.monthlyRevenue)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Monthly Expenses</span>
          <span className="text-sm font-medium text-white">
            {formatCurrency(idea.monthlyExpenses)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Profit Margin</span>
          <span className={`text-sm font-medium ${getProfitMarginColor(profitMargin)}`}>
            {profitMargin.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Current Loans</span>
          <span className="text-sm font-medium text-orange-400">
            {formatCurrency(idea.currentLoans)}
          </span>
        </div>
      </div>

      {/* Financial Breakdown Toggle */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFinancialBreakdown(!showFinancialBreakdown)}
          className="w-full justify-between"
        >
          <span>Financial Breakdown</span>
          <DollarSign size={16} />
        </Button>

        {showFinancialBreakdown && (
          <div className="mt-3 bg-slate-800/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Total Debt Settlement</span>
              <span className="text-sm font-medium text-white">
                {formatCurrency(idea.financialBreakdown.loanSettlement)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Founder Profit</span>
              <span className="text-sm font-medium text-green-400">
                {formatCurrency(idea.financialBreakdown.founderProfit)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Net Profit</span>
              <span className="text-sm font-medium text-blue-400">
                {formatCurrency(idea.financialBreakdown.netProfit)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Business Details */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-center">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Team Size</div>
          <div className="text-sm font-bold text-white">{idea.teamSize}</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Customers</div>
          <div className="text-sm font-bold text-white">{idea.traction.customers}</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Growth</div>
          <div className="text-sm font-bold text-green-400">+{idea.traction.growth}%</div>
        </div>
      </div>

      {/* IP & Assets */}
      <div className="mb-6">
        <div className="text-sm font-medium text-slate-300 mb-2">Assets & IP</div>
        <div className="flex flex-wrap gap-2">
          {idea.intellectualProperty.slice(0, 3).map((ip, index) => (
            <Badge key={index} variant="default" className="text-xs">
              <Lightbulb size={10} className="mr-1" />
              {ip}
            </Badge>
          ))}
          {idea.assets > 0 && (
            <Badge variant="default" className="text-xs">
              <Package size={10} className="mr-1" />
              Assets: {formatCurrency(idea.assets)}
            </Badge>
          )}
        </div>
      </div>

      {/* Sale Terms */}
      <div className="mb-6">
        <div className="text-sm font-medium text-slate-300 mb-2">Sale Terms</div>
        <div className="space-y-1 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle size={12} className="text-green-400" />
            {idea.saleTerms.includesAssets ? 'Includes Assets' : 'Assets Not Included'}
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={12} className="text-green-400" />
            {idea.saleTerms.includesIP ? 'Includes IP' : 'IP Not Included'}
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={12} className="text-green-400" />
            {idea.saleTerms.transitionSupport} weeks transition support
          </div>
          {idea.saleTerms.negotiation && (
            <div className="flex items-center gap-2">
              <AlertTriangle size={12} className="text-yellow-400" />
              Price negotiable
            </div>
          )}
        </div>
      </div>

      {/* Activity Metrics */}
      <div className="flex items-center justify-between mb-6 text-sm text-slate-400">
        <div className="flex items-center gap-1">
          <Eye size={14} />
          {idea.views} views
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={14} />
          {idea.inquiries} inquiries
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(idea.listedDate).toLocaleDateString()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          className="flex-1"
          onClick={() => onViewDetails?.(idea.id)}
        >
          View Details
        </Button>
        <Button 
          variant="secondary"
          onClick={() => onContact?.(idea.id)}
        >
          Contact
        </Button>
      </div>
    </Card>
  );
}
