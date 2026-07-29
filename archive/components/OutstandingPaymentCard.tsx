import React from 'react';
import { Card, Badge } from './ui';
import {
  Calendar,
  AlertTriangle,
  Clock,
  DollarSign,
  Building,
  FileText,
  CreditCard,
  Users,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { OutstandingPayment } from '../types';
import { formatCurrency, getPaymentStatusColor, getPriorityColor, getDaysUntilDue } from '../data/ecotrackMockData';

interface OutstandingPaymentCardProps {
  payment: OutstandingPayment;
  onMarkPaid?: (paymentId: string) => void;
  onViewDetails?: (paymentId: string) => void;
}

export default function OutstandingPaymentCard({ payment, onMarkPaid, onViewDetails }: OutstandingPaymentCardProps) {
  const getPaymentTypeIcon = (type: OutstandingPayment['paymentType']) => {
    switch (type) {
      case 'loan': return <DollarSign size={16} />;
      case 'invoice': return <FileText size={16} />;
      case 'supplier': return <Building size={16} />;
      case 'salary': return <Users size={16} />;
      case 'rent': return <CreditCard size={16} />;
    }
  };

  const getPaymentTypeLabel = (type: OutstandingPayment['paymentType']) => {
    switch (type) {
      case 'loan': return 'Loan Payment';
      case 'invoice': return 'Invoice';
      case 'supplier': return 'Supplier Payment';
      case 'salary': return 'Payroll';
      case 'rent': return 'Rent';
    }
  };

  const daysUntilDue = getDaysUntilDue(payment.dueDate);
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

  const getUrgencyColor = () => {
    if (isOverdue) return 'text-rose-600 bg-rose-50 border-rose-100';
    if (isDueSoon) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-slate-600 bg-slate-50 border-slate-100';
  };

  const getUrgencyTextColor = () => {
    if (isOverdue) return 'text-rose-600';
    if (isDueSoon) return 'text-amber-600';
    return 'text-slate-500';
  };

  const getUrgencyText = () => {
    if (isOverdue) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    if (isDueSoon) return `Due in ${daysUntilDue} days`;
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <Card className={`hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer border-slate-200 shadow-sm bg-white rounded-3xl relative overflow-hidden group ${isOverdue ? 'ring-1 ring-rose-200' : ''}`} onClick={() => onViewDetails?.(payment.id)}>

      {/* Visual Indicator Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isOverdue ? 'bg-rose-500' : isDueSoon ? 'bg-amber-500' : 'bg-slate-300'}`}></div>

      <div className="pl-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-white border shadow-sm ${isOverdue ? 'border-rose-100 text-rose-600' : 'border-slate-100 text-slate-500'}`}>
              {getPaymentTypeIcon(payment.paymentType)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{payment.recipient}</h3>
              <div className="flex items-center gap-2">
                <Badge className={`${getPaymentStatusColor(payment.status)} ring-1 ring-inset ring-black/5`}>
                  {payment.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</div>
            <div className="text-xl font-bold text-slate-900">{formatCurrency(payment.amount)}</div>
            {payment.lateFee && payment.lateFee > 0 && (
              <div className="text-xs font-bold text-rose-500 mt-0.5">+{formatCurrency(payment.lateFee)} late fee</div>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Type</span>
            <span className="text-sm font-semibold text-slate-700">{getPaymentTypeLabel(payment.paymentType)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Note</span>
            <span className="text-sm font-medium text-slate-600 text-right max-w-[60%] truncate">{payment.description}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Due Date</span>
            <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" />
              {new Date(payment.dueDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
            <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
            <span className={`text-sm font-bold px-2 py-0.5 rounded-md border ${getUrgencyColor()}`}>
              {getUrgencyText()}
            </span>
          </div>
        </div>

        {/* Visual Urgency Indicator */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className={getUrgencyTextColor()} />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeline</span>
          </div>
          <div className="relative pt-1">
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 relative ${isOverdue ? 'bg-rose-500' : isDueSoon ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                style={{
                  width: isOverdue ? '100%' : isDueSoon ? '75%' : '25%'
                }}
              >
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase">
              <span>Today</span>
              <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkPaid?.(payment.id);
            }}
            className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} /> Mark Paid
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle contact or remind action
            }}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Remind <ArrowRight size={16} />
          </button>
        </div>
      </div>

    </Card>
  );
}

// Helper icons
function CheckCircle({ size }: { size: number, className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
}
