export enum ViewType {
  DASHBOARD = 'dashboard',
  PARTNERS = 'partners',
  MARKET_ANALYSIS = 'market_analysis',
  STARTUP_SALE = 'startup_sale',
  ECOTRACK = 'ecotrack',
  PITCH_DECK = 'pitch_deck',
  WEBSITE_PREVIEW = 'website_preview'
}

export interface NavigationParams {
  view?: ViewType;
  industry?: string;
  funding_min?: number;
  funding_max?: number;
  profit_status?: 'profit' | 'loss' | 'break_even';
  location?: string;
  q?: string;
  action?: string;
  websiteId?: string;
}

export interface AGUIResponse {
  thought: string;
  navigation?: {
    path: string;
    params: NavigationParams;
    hash?: string;
  };
  message: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  industry: string;
  location: string;
  matchScore: number;
  tags: string[];
}

export interface Metric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

export interface LossReason {
  id: string;
  category: 'operational' | 'financial' | 'market' | 'strategic' | 'technical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  solutions: string[];
}

export interface StartupAnalysis {
  id: string;
  name: string;
  industry: string;
  currentRevenue: number;
  targetRevenue: number;
  lossPercentage: number;
  lossReasons: LossReason[];
  operationalChallenges: string[];
  financialHealth: 'poor' | 'struggling' | 'stable' | 'strong';
  timeInBusiness: number;
  teamSize: number;
}

export interface SuccessfulPartner {
  id: string;
  name: string;
  industry: string;
  location: string;
  expertise: string[];
  successMetrics: {
    revenueGrowth: number;
    profitability: number;
    marketShare: number;
    operationalEfficiency: number;
  };
  canHelpWith: string[];
  partnershipTerms: {
    investmentRange: { min: number; max: number };
    equityRequired: { min: number; max: number };
    timeCommitment: string;
    supportAreas: string[];
  };
  matchScore: number;
  caseStudies: {
    problem: string;
    solution: string;
    outcome: string;
  }[];
}

export interface StartupIdea {
  id: string;
  title: string;
  description: string;
  industry: string;
  founderName: string;
  contactEmail: string;
  currentLoans: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  assets: number;
  intellectualProperty: string[];
  teamSize: number;
  timeInBusiness: number;
  marketSize: number;
  competitiveAdvantage: string;
  businessModel: string;
  traction: {
    customers: number;
    revenue: number;
    growth: number;
  };
  valuation: {
    estimated: number;
    methodology: string;
    confidence: number;
  };
  saleTerms: {
    askingPrice: number;
    negotiation: boolean;
    includesAssets: boolean;
    includesIP: boolean;
    transitionSupport: number; // weeks
  };
  financialBreakdown: {
    totalDebt: number;
    netProfit: number;
    loanSettlement: number;
    founderProfit: number;
  };
  status: 'active' | 'pending' | 'sold' | 'withdrawn';
  listedDate: string;
  views: number;
  inquiries: number;
}

export interface IdeaBuyer {
  id: string;
  name: string;
  type: 'individual' | 'company' | 'vc';
  budget: { min: number; max: number };
  preferredIndustries: string[];
  experience: string[];
  contactInfo: {
    email: string;
    phone?: string;
    company?: string;
  };
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

export interface SaleTransaction {
  id: string;
  ideaId: string;
  buyerId: string;
  sellerId: string;
  agreedPrice: number;
  terms: {
    paymentSchedule: string;
    transitionPeriod: number;
    nonCompete: boolean;
    consultingPeriod: number;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdDate: string;
  completedDate?: string;
}

// EcoTrack Dashboard Types
export interface FundingStatus {
  id: string;
  startupId: string;
  startupName: string;
  totalRequested: number;
  totalRaised: number;
  percentageRaised: number;
  status: 'seeking' | 'funded' | 'partial' | 'rejected';
  investors: Investor[];
  lastUpdated: string;
  nextMilestone?: string;
}

export interface Investor {
  id: string;
  name: string;
  type: 'angel' | 'vc' | 'corporate' | 'crowd';
  amount: number;
  equityPercentage?: number;
  investmentDate: string;
  contactInfo: {
    email: string;
    phone?: string;
  };
}

export interface LoanDisbursement {
  id: string;
  startupId: string;
  loanAmount: number;
  amountDisbursed: number;
  remainingAmount: number;
  disbursementSchedule: DisbursementItem[];
  status: 'pending' | 'partial' | 'completed' | 'defaulted';
  interestRate: number;
  repaymentStartDate: string;
  nextPaymentDate?: string;
  lender: string;
}

export interface DisbursementItem {
  id: string;
  amount: number;
  date: string;
  status: 'scheduled' | 'disbursed' | 'pending';
  description: string;
}

export interface OutstandingPayment {
  id: string;
  startupId: string;
  paymentType: 'loan' | 'invoice' | 'supplier' | 'salary' | 'rent';
  amount: number;
  dueDate: string;
  status: 'overdue' | 'due_soon' | 'scheduled';
  priority: 'high' | 'medium' | 'low';
  recipient: string;
  description: string;
  lateFee?: number;
}

export interface MarketSizeAnalysis {
  id: string;
  industry: string;
  totalMarketSize: number;
  addressableMarket: number;
  obtainableMarket: number;
  growthRate: number;
  competitorCount: number;
  marketTrends: MarketTrend[];
  opportunities: string[];
  threats: string[];
  lastUpdated: string;
}

export interface MarketTrend {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timeframe: 'short_term' | 'medium_term' | 'long_term';
}

export interface EcoTrackMetrics {
  totalStartups: number;
  activeFunding: number;
  totalDisbursed: number;
  outstandingPayments: number;
  marketGrowth: number;
  avgFundingTime: number;
  repaymentRate: number;
  lastUpdated: string;
}