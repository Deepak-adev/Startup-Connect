import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../ui';
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  RefreshCw,
  Filter,
  Search,
  Eye,
  Activity,
  Layers
} from 'lucide-react';
import {
  FundingStatus,
  LoanDisbursement,
  OutstandingPayment,
  MarketSizeAnalysis,
  EcoTrackMetrics
} from '../../types';
import {
  MOCK_FUNDING_STATUS,
  MOCK_LOAN_DISBURSEMENTS,
  MOCK_OUTSTANDING_PAYMENTS,
  MOCK_MARKET_ANALYSIS,
  MOCK_ECOTRACK_METRICS,
  formatCurrency,
  formatPercentage
} from '../../data/ecotrackMockData';
import FundingStatusCard from '../FundingStatusCard';
import LoanDisbursementCard from '../LoanDisbursementCard';
import OutstandingPaymentCard from '../OutstandingPaymentCard';
import MarketAnalysisCard from '../MarketAnalysisCard';

type ViewMode = 'overview' | 'funding' | 'loans' | 'payments' | 'markets';

export default function EcoTrackView() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [metrics, setMetrics] = useState<EcoTrackMetrics>(MOCK_ECOTRACK_METRICS);
  const [fundingStatus, setFundingStatus] = useState<FundingStatus[]>(MOCK_FUNDING_STATUS);
  const [loanDisbursements, setLoanDisbursements] = useState<LoanDisbursement[]>(MOCK_LOAN_DISBURSEMENTS);
  const [outstandingPayments, setOutstandingPayments] = useState<OutstandingPayment[]>(MOCK_OUTSTANDING_PAYMENTS);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketSizeAnalysis[]>(MOCK_MARKET_ANALYSIS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Simulate small metric changes
      setMetrics(prev => ({
        ...prev,
        marketGrowth: prev.marketGrowth + (Math.random() - 0.5) * 0.2,
        totalDisbursed: prev.totalDisbursed + Math.floor(Math.random() * 1000),
        lastUpdated: new Date().toISOString()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const handleMarkPaymentPaid = (paymentId: string) => {
    setOutstandingPayments(prev => prev.filter(p => p.id !== paymentId));
  };

  const filteredData = {
    funding: fundingStatus.filter(f =>
      f.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.status.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    loans: loanDisbursements.filter(l =>
      l.lender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.status.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    payments: outstandingPayments.filter(p =>
      p.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentType.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    markets: marketAnalysis.filter(m =>
      m.industry.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  const getMetricCardColor = (label: string) => {
    switch (label) {
      case 'totalStartups': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'activeFunding': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'totalDisbursed': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'outstandingPayments': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'marketGrowth': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'repaymentRate': return 'text-teal-600 bg-teal-50 border-teal-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const renderMetricsOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="border-slate-200 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] bg-white rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Startups</div>
            <div className="text-2xl font-display font-bold text-slate-900">{metrics.totalStartups}</div>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] bg-white rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <Target size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Funding</div>
            <div className="text-2xl font-display font-bold text-slate-900">{metrics.activeFunding}</div>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] bg-white rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Disbursed</div>
            <div className="text-2xl font-display font-bold text-slate-900">{formatCurrency(metrics.totalDisbursed)}</div>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] bg-white rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outstanding</div>
            <div className="text-2xl font-display font-bold text-slate-900">{formatCurrency(metrics.outstandingPayments)}</div>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] bg-white rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Growth</div>
            <div className="text-2xl font-display font-bold text-slate-900">{formatPercentage(metrics.marketGrowth)}</div>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] bg-white rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-50 text-teal-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Repayment Rate</div>
            <div className="text-2xl font-display font-bold text-slate-900">{formatPercentage(metrics.repaymentRate)}</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderViewModeContent = () => {
    switch (viewMode) {
      case 'funding':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Funding Status</h2>
              <Badge variant="default" className="bg-slate-900">{filteredData.funding.length} Active</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredData.funding.map(funding => (
                <FundingStatusCard
                  key={funding.id}
                  funding={funding}
                  onViewDetails={(id) => console.log('View funding details:', id)}
                />
              ))}
            </div>
          </div>
        );

      case 'loans':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Loan Disbursements</h2>
              <Badge variant="default" className="bg-slate-900">{filteredData.loans.length} Active</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredData.loans.map(loan => (
                <LoanDisbursementCard
                  key={loan.id}
                  loan={loan}
                  onViewDetails={(id) => console.log('View loan details:', id)}
                />
              ))}
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Outstanding Payments</h2>
              <Badge variant="default" className="bg-slate-900">{filteredData.payments.length} Pending</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredData.payments.map(payment => (
                <OutstandingPaymentCard
                  key={payment.id}
                  payment={payment}
                  onMarkPaid={handleMarkPaymentPaid}
                  onViewDetails={(id) => console.log('View payment details:', id)}
                />
              ))}
            </div>
          </div>
        );

      case 'markets':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Market Analysis</h2>
              <Badge variant="default" className="bg-slate-900">{filteredData.markets.length} Industries</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredData.markets.map(market => (
                <MarketAnalysisCard
                  key={market.id}
                  market={market}
                  onViewDetails={(id) => console.log('View market details:', id)}
                />
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {renderMetricsOverview()}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-slate-200 shadow-sm bg-white rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Activity size={20} className="text-emerald-500" />
                    Recent Activity
                  </h3>
                  <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50" onClick={() => setViewMode('funding')}>View All</Button>
                </div>
                <div className="space-y-4">
                  {fundingStatus.slice(0, 3).map(funding => (
                    <div key={funding.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-emerald-200 transition-colors cursor-pointer">
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{funding.startupName}</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase mt-0.5">{funding.status}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">{formatCurrency(funding.totalRaised)}</div>
                        <div className="text-xs font-semibold text-emerald-600">{formatPercentage(funding.percentageRaised)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-slate-200 shadow-sm bg-white rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Clock size={20} className="text-amber-500" />
                    Upcoming Due
                  </h3>
                  <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50" onClick={() => setViewMode('payments')}>View All</Button>
                </div>
                <div className="space-y-4">
                  {outstandingPayments.slice(0, 3).map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-amber-200 transition-colors cursor-pointer">
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{payment.recipient}</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase mt-0.5">{payment.paymentType}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">{formatCurrency(payment.amount)}</div>
                        <div className="text-xs font-semibold text-amber-600">{new Date(payment.dueDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 bg-slate-50/50 min-h-screen pb-10 px-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">EcoTrack Financials</h1>
          <p className="text-slate-500 mt-1 text-lg">
            Real-time monitoring of fund flows, loans, and market sustainability data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 h-11 px-5 rounded-xl border-slate-200 hover:bg-white hover:text-indigo-600 transition-all shadow-sm bg-white"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'funding', label: 'Funding', icon: Target },
          { id: 'loans', label: 'Disbursements', icon: DollarSign },
          { id: 'payments', label: 'Payments', icon: AlertTriangle },
          { id: 'markets', label: 'Markets', icon: BarChart3 }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setViewMode(id as ViewMode)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === id
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-[1.02]'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white'
              }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-lg">
        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search across all financial data..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
        />
      </div>

      {/* Main Content */}
      {renderViewModeContent()}
    </div>
  );
}
