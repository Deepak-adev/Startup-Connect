import React from 'react';
import { Card, Badge } from './ui';
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Calendar
} from 'lucide-react';
import { FundingStatus } from '../types';
import { formatCurrency, formatPercentage, getFundingStatusColor } from '../data/ecotrackMockData';

interface FundingStatusCardProps {
  funding: FundingStatus;
  onViewDetails?: (fundingId: string) => void;
}

export default function FundingStatusCard({ funding, onViewDetails }: FundingStatusCardProps) {
  const getStatusIcon = (status: FundingStatus['status']) => {
    switch (status) {
      case 'funded': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'partial': return <Clock size={16} className="text-indigo-500" />;
      case 'seeking': return <Search size={16} className="text-amber-500" />;
      case 'rejected': return <AlertCircle size={16} className="text-rose-500" />;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-emerald-500';
    if (percentage >= 50) return 'bg-indigo-500';
    if (percentage >= 25) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <Card className="hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer border-slate-200 shadow-sm bg-white group rounded-3xl" onClick={() => onViewDetails?.(funding.id)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{funding.startupName}</h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(funding.status)}
            <Badge className={`${getFundingStatusColor(funding.status)} ring-1 ring-inset ring-opacity-10 border-transparent`}>
              {funding.status.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progress</div>
          <div className="text-xl font-bold text-slate-900">{formatPercentage(funding.percentageRaised)}</div>
        </div>
      </div>

      {/* Funding Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2 font-medium">
          <span className="text-slate-500">Raised</span>
          <span className="text-slate-900 font-bold">
            {formatCurrency(funding.totalRaised)} <span className="text-slate-400 font-normal">/ {formatCurrency(funding.totalRequested)}</span>
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(funding.percentageRaised)} shadow-sm`}
            style={{ width: `${Math.min(funding.percentageRaised, 100)}%` }}
          />
        </div>
      </div>

      {/* Investors */}
      <div className="mb-4 bg-slate-50 rounded-2xl p-3 border border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <Users size={14} className="text-slate-400" />
          <span>{funding.investors.length} Investors</span>
        </div>
        <div className="space-y-2">
          {funding.investors.slice(0, 2).map((investor, index) => (
            <div key={investor.id} className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">{investor.name}</span>
              <span className="text-slate-900 font-bold">{formatCurrency(investor.amount)}</span>
            </div>
          ))}
          {funding.investors.length > 2 && (
            <div className="text-xs text-indigo-600 font-semibold pt-1">
              +{funding.investors.length - 2} more investors
            </div>
          )}
        </div>
      </div>

      {/* Milestone */}
      {funding.nextMilestone && (
        <div className="mb-4 flex items-start gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mt-0.5">
            <Target size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Next Milestone</div>
            <div className="text-sm font-semibold text-slate-700 leading-snug">{funding.nextMilestone}</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar size={14} />
          <span>Updated {new Date(funding.lastUpdated).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          <DollarSign size={14} strokeWidth={3} />
          <span>{formatCurrency(funding.totalRaised - (funding.totalRequested * 0.05))} net</span>
        </div>
      </div>
    </Card>
  );
}
