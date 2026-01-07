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
  TrendingUp
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
      case 'loan': return <DollarSign size={14} />;
      case 'invoice': return <FileText size={14} />;
      case 'supplier': return <Building size={14} />;
      case 'salary': return <Users size={14} />;
      case 'rent': return <CreditCard size={14} />;
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
    if (isOverdue) return 'text-red-400';
    if (isDueSoon) return 'text-orange-400';
    return 'text-slate-400';
  };

  const getUrgencyText = () => {
    if (isOverdue) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    if (isDueSoon) return `Due in ${daysUntilDue} days`;
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetails?.(payment.id)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-slate-800/50 ${getPriorityColor(payment.priority)}`}>
            {getPaymentTypeIcon(payment.paymentType)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{payment.recipient}</h3>
            <div className="flex items-center gap-2">
              <Badge className={getPaymentStatusColor(payment.status)}>
                {payment.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="default" className="text-xs">
                {payment.priority.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Amount</div>
          <div className="text-xl font-bold text-white">{formatCurrency(payment.amount)}</div>
          {payment.lateFee && payment.lateFee > 0 && (
            <div className="text-xs text-red-400">+{formatCurrency(payment.lateFee)} late fee</div>
          )}
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Payment Type</span>
          <span className="text-sm text-white">{getPaymentTypeLabel(payment.paymentType)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Description</span>
          <span className="text-sm text-white text-right max-w-[60%] truncate">{payment.description}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Due Date</span>
          <span className="text-sm text-white">{new Date(payment.dueDate).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Urgency</span>
          <span className={`text-sm font-medium ${getUrgencyColor()}`}>
            {getUrgencyText()}
          </span>
        </div>
      </div>

      {/* Visual Urgency Indicator */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={14} className={getUrgencyColor()} />
          <span className="text-sm text-slate-400">Payment Timeline</span>
        </div>
        <div className="relative">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isOverdue ? 'bg-red-500' : isDueSoon ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ 
                width: isOverdue ? '100%' : isDueSoon ? '75%' : '25%'
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Today</span>
            <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-slate-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkPaid?.(payment.id);
          }}
          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
        >
          Mark Paid
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Handle contact or remind action
          }}
          className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
        >
          Send Reminder
        </button>
      </div>

      {/* Priority Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-3 h-3 rounded-full ${getPriorityColor(payment.priority)} animate-pulse`} />
      </div>
    </Card>
  );
}
