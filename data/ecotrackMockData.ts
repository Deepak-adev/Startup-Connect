import { 
  FundingStatus, 
  LoanDisbursement, 
  OutstandingPayment, 
  MarketSizeAnalysis, 
  EcoTrackMetrics,
  Investor,
  DisbursementItem,
  MarketTrend
} from '../types';

export const MOCK_FUNDING_STATUS: FundingStatus[] = [
  {
    id: 'fund-1',
    startupId: 'startup-1',
    startupName: 'TechFlow Solutions',
    totalRequested: 500000,
    totalRaised: 350000,
    percentageRaised: 70,
    status: 'partial',
    investors: [
      {
        id: 'inv-1',
        name: 'Angel Ventures',
        type: 'angel',
        amount: 200000,
        equityPercentage: 15,
        investmentDate: '2024-01-15',
        contactInfo: {
          email: 'contact@angelventures.com',
          phone: '+1-555-0101'
        }
      },
      {
        id: 'inv-2',
        name: 'Seed Capital Fund',
        type: 'vc',
        amount: 150000,
        equityPercentage: 10,
        investmentDate: '2024-02-01',
        contactInfo: {
          email: 'invest@seedcapital.com'
        }
      }
    ],
    lastUpdated: '2024-01-20',
    nextMilestone: 'Product Launch - Q2 2024'
  },
  {
    id: 'fund-2',
    startupId: 'startup-2',
    startupName: 'GreenEnergy Co',
    totalRequested: 1000000,
    totalRaised: 1000000,
    percentageRaised: 100,
    status: 'funded',
    investors: [
      {
        id: 'inv-3',
        name: 'Climate Impact VC',
        type: 'vc',
        amount: 750000,
        equityPercentage: 20,
        investmentDate: '2024-01-10',
        contactInfo: {
          email: 'invest@climateimpact.com'
        }
      },
      {
        id: 'inv-4',
        name: 'Corporate Green Fund',
        type: 'corporate',
        amount: 250000,
        equityPercentage: 8,
        investmentDate: '2024-01-25',
        contactInfo: {
          email: 'green@corporate.com'
        }
      }
    ],
    lastUpdated: '2024-01-25',
    nextMilestone: 'Market Expansion - Q3 2024'
  },
  {
    id: 'fund-3',
    startupId: 'startup-3',
    startupName: 'HealthTech Innovations',
    totalRequested: 750000,
    totalRaised: 0,
    percentageRaised: 0,
    status: 'seeking',
    investors: [],
    lastUpdated: '2024-01-22',
    nextMilestone: 'FDA Approval - Q4 2024'
  }
];

export const MOCK_LOAN_DISBURSEMENTS: LoanDisbursement[] = [
  {
    id: 'loan-1',
    startupId: 'startup-1',
    loanAmount: 300000,
    amountDisbursed: 150000,
    remainingAmount: 150000,
    disbursementSchedule: [
      {
        id: 'dis-1',
        amount: 150000,
        date: '2024-01-15',
        status: 'disbursed',
        description: 'Initial tranche for product development'
      },
      {
        id: 'dis-2',
        amount: 100000,
        date: '2024-03-15',
        status: 'scheduled',
        description: 'Second tranche for marketing'
      },
      {
        id: 'dis-3',
        amount: 50000,
        date: '2024-06-15',
        status: 'scheduled',
        description: 'Final tranche for operations'
      }
    ],
    status: 'partial',
    interestRate: 6.5,
    repaymentStartDate: '2025-01-15',
    nextPaymentDate: '2024-03-15',
    lender: 'National Business Bank'
  },
  {
    id: 'loan-2',
    startupId: 'startup-2',
    loanAmount: 500000,
    amountDisbursed: 500000,
    remainingAmount: 0,
    disbursementSchedule: [
      {
        id: 'dis-4',
        amount: 250000,
        date: '2024-01-10',
        status: 'disbursed',
        description: 'Equipment purchase'
      },
      {
        id: 'dis-5',
        amount: 250000,
        date: '2024-01-20',
        status: 'disbursed',
        description: 'Working capital'
      }
    ],
    status: 'completed',
    interestRate: 5.8,
    repaymentStartDate: '2025-01-10',
    lender: 'Green Financing Corp'
  }
];

export const MOCK_OUTSTANDING_PAYMENTS: OutstandingPayment[] = [
  {
    id: 'pay-1',
    startupId: 'startup-1',
    paymentType: 'loan',
    amount: 2500,
    dueDate: '2024-02-15',
    status: 'due_soon',
    priority: 'high',
    recipient: 'National Business Bank',
    description: 'Monthly loan payment',
    lateFee: 100
  },
  {
    id: 'pay-2',
    startupId: 'startup-1',
    paymentType: 'supplier',
    amount: 15000,
    dueDate: '2024-02-01',
    status: 'overdue',
    priority: 'high',
    recipient: 'Tech Components Ltd',
    description: 'Raw materials purchase',
    lateFee: 500
  },
  {
    id: 'pay-3',
    startupId: 'startup-2',
    paymentType: 'salary',
    amount: 45000,
    dueDate: '2024-02-05',
    status: 'scheduled',
    priority: 'medium',
    recipient: 'Employee Payroll',
    description: 'Monthly payroll'
  },
  {
    id: 'pay-4',
    startupId: 'startup-3',
    paymentType: 'rent',
    amount: 8000,
    dueDate: '2024-02-01',
    status: 'scheduled',
    priority: 'medium',
    recipient: 'Office Space LLC',
    description: 'Monthly office rent'
  }
];

export const MOCK_MARKET_ANALYSIS: MarketSizeAnalysis[] = [
  {
    id: 'market-1',
    industry: 'Technology',
    totalMarketSize: 5000000000,
    addressableMarket: 1500000000,
    obtainableMarket: 300000000,
    growthRate: 12.5,
    competitorCount: 250,
    marketTrends: [
      {
        id: 'trend-1',
        title: 'AI Integration Surge',
        description: 'Increasing adoption of AI in business applications',
        impact: 'positive',
        confidence: 85,
        timeframe: 'short_term'
      },
      {
        id: 'trend-2',
        title: 'Remote Work Tools',
        description: 'Continued demand for remote collaboration solutions',
        impact: 'positive',
        confidence: 75,
        timeframe: 'medium_term'
      }
    ],
    opportunities: [
      'AI-powered automation tools',
      'Cybersecurity solutions',
      'Cloud migration services'
    ],
    threats: [
      'Increasing competition',
      'Talent shortage',
      'Regulatory challenges'
    ],
    lastUpdated: '2024-01-20'
  },
  {
    id: 'market-2',
    industry: 'Healthcare',
    totalMarketSize: 8000000000,
    addressableMarket: 2000000000,
    obtainableMarket: 400000000,
    growthRate: 8.3,
    competitorCount: 180,
    marketTrends: [
      {
        id: 'trend-3',
        title: 'Telemedicine Growth',
        description: 'Expansion of remote healthcare services',
        impact: 'positive',
        confidence: 90,
        timeframe: 'short_term'
      },
      {
        id: 'trend-4',
        title: 'Aging Population',
        description: 'Increasing healthcare demand from elderly population',
        impact: 'positive',
        confidence: 95,
        timeframe: 'long_term'
      }
    ],
    opportunities: [
      'Digital health platforms',
      'Personalized medicine',
      'Preventive care solutions'
    ],
    threats: [
      'Healthcare regulations',
      'Insurance reimbursement challenges',
      'Data privacy concerns'
    ],
    lastUpdated: '2024-01-18'
  },
  {
    id: 'market-3',
    industry: 'Renewable Energy',
    totalMarketSize: 12000000000,
    addressableMarket: 4000000000,
    obtainableMarket: 800000000,
    growthRate: 15.7,
    competitorCount: 120,
    marketTrends: [
      {
        id: 'trend-5',
        title: 'Government Incentives',
        description: 'Increased government support for green energy',
        impact: 'positive',
        confidence: 88,
        timeframe: 'medium_term'
      },
      {
        id: 'trend-6',
        title: 'Battery Technology',
        description: 'Advances in energy storage solutions',
        impact: 'positive',
        confidence: 82,
        timeframe: 'short_term'
      }
    ],
    opportunities: [
      'Solar energy solutions',
      'Wind power technology',
      'Energy storage systems'
    ],
    threats: [
      'Policy changes',
      'Supply chain disruptions',
      'Competition from traditional energy'
    ],
    lastUpdated: '2024-01-22'
  }
];

export const MOCK_ECOTRACK_METRICS: EcoTrackMetrics = {
  totalStartups: 45,
  activeFunding: 12,
  totalDisbursed: 2850000,
  outstandingPayments: 185000,
  marketGrowth: 14.2,
  avgFundingTime: 45,
  repaymentRate: 92.5,
  lastUpdated: '2024-01-23'
};

// Helper functions for data manipulation
export const getFundingStatusColor = (status: FundingStatus['status']) => {
  switch (status) {
    case 'funded': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'partial': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'seeking': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
};

export const getPaymentStatusColor = (status: OutstandingPayment['status']) => {
  switch (status) {
    case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'due_soon': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'scheduled': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

export const getPriorityColor = (priority: OutstandingPayment['priority']) => {
  switch (priority) {
    case 'high': return 'text-red-400';
    case 'medium': return 'text-yellow-400';
    case 'low': return 'text-green-400';
  }
};

export const getTrendImpactColor = (impact: MarketTrend['impact']) => {
  switch (impact) {
    case 'positive': return 'text-green-400';
    case 'negative': return 'text-red-400';
    case 'neutral': return 'text-slate-400';
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

export const getDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
