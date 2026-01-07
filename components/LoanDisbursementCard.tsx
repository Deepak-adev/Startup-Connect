import React, { useState } from 'react';
import { Card, Badge } from './ui';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  Percent,
  Eye,
  EyeOff
} from 'lucide-react';
import { LoanDisbursement } from '../types';
import { formatCurrency, formatPercentage } from '../data/ecotrackMockData';

interface LoanDisbursementCardProps {
  loan: LoanDisbursement;
  onViewDetails?: (loanId: string) => void;
}

export default function LoanDisbursementCard({ loan, onViewDetails }: LoanDisbursementCardProps) {
  const [showSchedule, setShowSchedule] = useState(false);

  const getStatusColor = (status: LoanDisbursement['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'partial': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'defaulted': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getStatusIcon = (status: LoanDisbursement['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-400" />;
      case 'partial': return <Clock size={16} className="text-blue-400" />;
      case 'pending': return <AlertCircle size={16} className="text-yellow-400" />;
      case 'defaulted': return <AlertCircle size={16} className="text-red-400" />;
    }
  };

  const getDisbursementStatusColor = (status: string) => {
    switch (status) {
      case 'disbursed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-slate-500';
    }
  };

  const progressPercentage = (loan.amountDisbursed / loan.loanAmount) * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Loan #{loan.id.slice(-6)}</h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(loan.status)}
            <Badge className={getStatusColor(loan.status)}>
              {loan.status.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Disbursed</div>
          <div className="text-xl font-bold text-white">{formatPercentage(progressPercentage)}</div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-slate-400 mb-1">Total Loan</div>
          <div className="text-lg font-semibold text-white">{formatCurrency(loan.loanAmount)}</div>
        </div>
        <div>
          <div className="text-sm text-slate-400 mb-1">Disbursed</div>
          <div className="text-lg font-semibold text-green-400">{formatCurrency(loan.amountDisbursed)}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Progress</span>
          <span className="text-white">
            {formatCurrency(loan.amountDisbursed)} / {formatCurrency(loan.loanAmount)}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Loan Terms */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Percent size={14} className="text-slate-400" />
          <div>
            <div className="text-xs text-slate-400">Interest Rate</div>
            <div className="text-sm font-medium text-white">{loan.interestRate}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Building size={14} className="text-slate-400" />
          <div>
            <div className="text-xs text-slate-400">Lender</div>
            <div className="text-sm font-medium text-white truncate">{loan.lender}</div>
          </div>
        </div>
      </div>

      {/* Important Dates */}
      <div className="space-y-2 mb-4">
        {loan.nextPaymentDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Next Payment</span>
            <span className="text-white">{new Date(loan.nextPaymentDate).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Repayment Start</span>
          <span className="text-white">{new Date(loan.repaymentStartDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Disbursement Schedule Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="flex items-center justify-between w-full text-sm text-slate-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            {showSchedule ? <EyeOff size={14} /> : <Eye size={14} />}
            Disbursement Schedule
          </span>
          <span className="text-xs text-slate-400">
            {loan.disbursementSchedule.length} items
          </span>
        </button>

        {showSchedule && (
          <div className="mt-3 space-y-2">
            {loan.disbursementSchedule.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getDisbursementStatusColor(item.status)}`} />
                  <div>
                    <div className="text-xs text-white">{item.description}</div>
                    <div className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{formatCurrency(item.amount)}</div>
                  <div className="text-xs text-slate-400 capitalize">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remaining Amount */}
      <div className="pt-3 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Remaining Amount</span>
          <span className="text-lg font-bold text-orange-400">{formatCurrency(loan.remainingAmount)}</span>
        </div>
      </div>
    </Card>
  );
}
