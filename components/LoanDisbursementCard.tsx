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
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20';
      case 'partial': return 'bg-indigo-50 text-indigo-700 border-indigo-100 ring-indigo-500/20';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20';
      case 'defaulted': return 'bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/20';
    }
  };

  const getStatusIcon = (status: LoanDisbursement['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'partial': return <Clock size={16} className="text-indigo-500" />;
      case 'pending': return <AlertCircle size={16} className="text-amber-500" />;
      case 'defaulted': return <AlertCircle size={16} className="text-rose-500" />;
    }
  };

  const getDisbursementStatusColor = (status: string) => {
    switch (status) {
      case 'disbursed': return 'bg-emerald-500';
      case 'scheduled': return 'bg-indigo-500';
      case 'pending': return 'bg-amber-500';
      default: return 'bg-slate-300';
    }
  };

  const progressPercentage = (loan.amountDisbursed / loan.loanAmount) * 100;

  return (
    <Card className="hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 border-slate-200 shadow-sm bg-white rounded-3xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Loan #{loan.id.slice(-6)}</h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(loan.status)}
            <Badge className={`${getStatusColor(loan.status)} text-xs font-bold px-2 py-0.5 rounded-lg border`}>
              {loan.status.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disbursed</div>
          <div className="text-2xl font-display font-bold text-slate-900">{formatPercentage(progressPercentage)}</div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Loan</div>
          <div className="text-lg font-bold text-slate-900">{formatCurrency(loan.loanAmount)}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Disbursed</div>
          <div className="text-lg font-bold text-emerald-600">{formatCurrency(loan.amountDisbursed)}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 font-medium">
          <span className="text-slate-500">Progress</span>
          <span className="text-slate-900 font-bold">
            {formatCurrency(loan.amountDisbursed)} <span className="text-slate-400 font-normal">/ {formatCurrency(loan.loanAmount)}</span>
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Loan Terms */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
            <Percent size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Interest Rate</div>
            <div className="text-sm font-bold text-slate-900">{loan.interestRate}%</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
            <Building size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Lender</div>
            <div className="text-sm font-bold text-slate-900 truncate">{loan.lender}</div>
          </div>
        </div>
      </div>

      {/* Important Dates */}
      <div className="space-y-3 mb-6 bg-slate-50/50 p-4 rounded-xl border border-dotted border-slate-200">
        {loan.nextPaymentDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Next Payment</span>
            <span className="text-slate-900 font-bold">{new Date(loan.nextPaymentDate).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">Repayment Start</span>
          <span className="text-slate-900 font-bold">{new Date(loan.repaymentStartDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Disbursement Schedule Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="flex items-center justify-between w-full text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
        >
          <span className="flex items-center gap-2">
            {showSchedule ? <EyeOff size={16} /> : <Eye size={16} />}
            Disbursement Schedule
          </span>
          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
            {loan.disbursementSchedule.length} payments
          </span>
        </button>

        {showSchedule && (
          <div className="mt-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {loan.disbursementSchedule.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${getDisbursementStatusColor(item.status)} ring-4 ring-white`} />
                  <div>
                    <div className="text-xs font-bold text-slate-700">{item.description}</div>
                    <div className="text-[10px] font-medium text-slate-400">{new Date(item.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">{formatCurrency(item.amount)}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remaining Amount */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Remaining Amount</span>
          <span className="text-xl font-bold text-indigo-600">{formatCurrency(loan.remainingAmount)}</span>
        </div>
      </div>
    </Card>
  );
}
