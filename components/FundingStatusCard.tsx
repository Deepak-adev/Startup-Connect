import React from 'react';
import { Card, Badge } from './ui';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Target,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Search
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
      case 'funded': return <CheckCircle size={16} className="text-green-400" />;
      case 'partial': return <Clock size={16} className="text-blue-400" />;
      case 'seeking': return <Search size={16} className="text-yellow-400" />;
      case 'rejected': return <AlertCircle size={16} className="text-red-400" />;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetails?.(funding.id)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{funding.startupName}</h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(funding.status)}
            <Badge className={getFundingStatusColor(funding.status)}>
              {funding.status.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Progress</div>
          <div className="text-xl font-bold text-white">{formatPercentage(funding.percentageRaised)}</div>
        </div>
      </div>

      {/* Funding Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Raised</span>
          <span className="text-white">
            {formatCurrency(funding.totalRaised)} / {formatCurrency(funding.totalRequested)}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(funding.percentageRaised)}`}
            style={{ width: `${Math.min(funding.percentageRaised, 100)}%` }}
          />
        </div>
      </div>

      {/* Investors */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <Users size={14} />
          <span>{funding.investors.length} Investors</span>
        </div>
        <div className="space-y-1">
          {funding.investors.slice(0, 2).map((investor, index) => (
            <div key={investor.id} className="flex justify-between items-center text-xs">
              <span className="text-slate-300">{investor.name}</span>
              <span className="text-white">{formatCurrency(investor.amount)}</span>
            </div>
          ))}
          {funding.investors.length > 2 && (
            <div className="text-xs text-slate-400">
              +{funding.investors.length - 2} more investors
            </div>
          )}
        </div>
      </div>

      {/* Milestone */}
      {funding.nextMilestone && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Target size={14} />
            <span>Next Milestone</span>
          </div>
          <div className="text-xs text-slate-300">{funding.nextMilestone}</div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>Updated {new Date(funding.lastUpdated).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign size={12} />
          <span>{formatCurrency(funding.totalRaised - (funding.totalRequested * 0.05))} net</span>
        </div>
      </div>
    </Card>
  );
}
