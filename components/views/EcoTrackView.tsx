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
  Eye
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
      case 'totalStartups': return 'from-blue-500/10 to-blue-600/10 border-blue-500/20';
      case 'activeFunding': return 'from-green-500/10 to-green-600/10 border-green-500/20';
      case 'totalDisbursed': return 'from-purple-500/10 to-purple-600/10 border-purple-500/20';
      case 'outstandingPayments': return 'from-orange-500/10 to-orange-600/10 border-orange-500/20';
      case 'marketGrowth': return 'from-indigo-500/10 to-indigo-600/10 border-indigo-500/20';
      case 'repaymentRate': return 'from-teal-500/10 to-teal-600/10 border-teal-500/20';
      default: return 'from-slate-500/10 to-slate-600/10 border-slate-500/20';
    }
  };

  const renderMetricsOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className={`bg-gradient-to-br ${getMetricCardColor('totalStartups')}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Users size={20} className="text-blue-400" />
          </div>
          <div>
            <div className="text-sm text-slate-400">Total Startups</div>
            <div className="text-xl font-bold text-white">{metrics.totalStartups}</div>
          </div>
        </div>
      </Card>

      <Card className={`bg-gradient-to-br ${getMetricCardColor('activeFunding')}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <Target size={20} className="text-green-400" />
          </div>
          <div>
            <div className="text-sm text-slate-400">Active Funding</div>
            <div className="text-xl font-bold text-white">{metrics.activeFunding}</div>
          </div>
        </div>
      </Card>

      <Card className={`bg-gradient-to-br ${getMetricCardColor('totalDisbursed')}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <DollarSign size={20} className="text-purple-400" />
          </div>
          <div>
            <div className="text-sm text-slate-400">Total Disbursed</div>
            <div className="text-xl font-bold text-white">{formatCurrency(metrics.totalDisbursed)}</div>
          </div>
        </div>
      </Card>

      <Card className={`bg-gradient-to-br ${getMetricCardColor('outstandingPayments')}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20">
            <AlertTriangle size={20} className="text-orange-400" />
          </div>
          <div>
            <div className="text-sm text-slate-400">Outstanding Payments</div>
            <div className="text-xl font-bold text-white">{formatCurrency(metrics.outstandingPayments)}</div>
          </div>
        </div>
      </Card>

      <Card className={`bg-gradient-to-br ${getMetricCardColor('marketGrowth')}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20">
            <TrendingUp size={20} className="text-indigo-400" />
          </div>
          <div>
            <div className="text-sm text-slate-400">Market Growth</div>
            <div className="text-xl font-bold text-white">{formatPercentage(metrics.marketGrowth)}</div>
          </div>
        </div>
      </Card>

      <Card className={`bg-gradient-to-br ${getMetricCardColor('repaymentRate')}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/20">
            <CheckCircle size={20} className="text-teal-400" />
          </div>
          <div>
            <div className="text-sm text-slate-400">Repayment Rate</div>
            <div className="text-xl font-bold text-white">{formatPercentage(metrics.repaymentRate)}</div>
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
              <h2 className="text-xl font-semibold text-white">Funding Status</h2>
              <Badge variant="default">{filteredData.funding.length} Active</Badge>
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
              <h2 className="text-xl font-semibold text-white">Loan Disbursements</h2>
              <Badge variant="default">{filteredData.loans.length} Active</Badge>
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
              <h2 className="text-xl font-semibold text-white">Outstanding Payments</h2>
              <Badge variant="default">{filteredData.payments.length} Pending</Badge>
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
              <h2 className="text-xl font-semibold text-white">Market Analysis</h2>
              <Badge variant="default">{filteredData.markets.length} Industries</Badge>
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
          <div className="space-y-6">
            {renderMetricsOverview()}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Funding Activity</h3>
                <div className="space-y-3">
                  {fundingStatus.slice(0, 3).map(funding => (
                    <div key={funding.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">{funding.startupName}</div>
                        <div className="text-xs text-slate-400">{funding.status}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{formatCurrency(funding.totalRaised)}</div>
                        <div className="text-xs text-slate-400">{formatPercentage(funding.percentageRaised)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Upcoming Payments</h3>
                <div className="space-y-3">
                  {outstandingPayments.slice(0, 3).map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">{payment.recipient}</div>
                        <div className="text-xs text-slate-400">{payment.paymentType}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{formatCurrency(payment.amount)}</div>
                        <div className="text-xs text-slate-400">{new Date(payment.dueDate).toLocaleDateString()}</div>
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">EcoTrack Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Real-time monitoring of funding status, loan disbursals, payments, and market analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <Card className="border-slate-700">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'funding', label: 'Funding', icon: Target },
            { id: 'loans', label: 'Loans', icon: DollarSign },
            { id: 'payments', label: 'Payments', icon: AlertTriangle },
            { id: 'markets', label: 'Markets', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setViewMode(id as ViewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === id
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Search Bar */}
      <Card className="border-slate-700">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search startups, lenders, payments, or industries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </Card>

      {/* Main Content */}
      {renderViewModeContent()}
    </div>
  );
}
