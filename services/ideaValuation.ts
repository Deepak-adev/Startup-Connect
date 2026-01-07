import { StartupIdea } from '../types';

export interface ValuationFactors {
  monthlyRevenue: number;
  monthlyExpenses: number;
  assets: number;
  currentLoans: number;
  teamSize: number;
  timeInBusiness: number;
  marketSize: number;
  customerCount: number;
  revenueGrowth: number;
  intellectualPropertyCount: number;
}

export interface ValuationResult {
  estimatedValue: number;
  methodology: string;
  confidence: number;
  breakdown: {
    revenueMultiple: number;
    assetValue: number;
    ipValue: number;
    teamValue: number;
    marketPotential: number;
    debtAdjustment: number;
  };
  recommendations: string[];
}

export class IdeaValuationService {
  private static readonly INDUSTRY_MULTIPLIERS: { [key: string]: number } = {
    'technology': 3.5,
    'software': 4.0,
    'fintech': 3.8,
    'healthcare': 2.8,
    'ecommerce': 2.5,
    'manufacturing': 1.8,
    'retail': 1.5,
    'food': 1.3,
    'education': 2.2,
    'transportation': 2.0,
    'real-estate': 2.5,
    'consulting': 1.8,
    'media': 2.3,
    'agriculture': 1.4,
    'textile': 1.2,
    'default': 2.0
  };

  private static readonly IP_VALUE_MULTIPLIERS: { [key: string]: number } = {
    'patent': 50000,
    'trademark': 10000,
    'copyright': 5000,
    'trade-secret': 25000,
    'software': 30000,
    'design': 15000
  };

  static calculateValuation(factors: ValuationFactors, industry: string): ValuationResult {
    const industryMultiplier = this.getIndustryMultiplier(industry);
    
    // Revenue-based valuation
    const monthlyProfit = factors.monthlyRevenue - factors.monthlyExpenses;
    const annualProfit = monthlyProfit * 12;
    const revenueMultiple = this.getRevenueMultiple(factors.timeInBusiness, factors.revenueGrowth);
    const revenueValue = Math.max(0, annualProfit * revenueMultiple * industryMultiplier);

    // Asset valuation
    const assetValue = factors.assets;

    // Intellectual property valuation
    const ipValue = factors.intellectualPropertyCount * 25000; // Average IP value

    // Team valuation (based on size and experience)
    const teamValue = factors.teamSize * 8000; // $8k per team member

    // Market potential adjustment
    const marketPotential = Math.min(factors.marketSize * 0.001, 100000); // 0.1% of market size, max $100k

    // Debt adjustment (subtract from total)
    const debtAdjustment = factors.currentLoans;

    // Calculate total valuation
    const totalValue = revenueValue + assetValue + ipValue + teamValue + marketPotential - debtAdjustment;

    // Calculate confidence score
    const confidence = this.calculateConfidence(factors, totalValue);

    // Generate recommendations
    const recommendations = this.generateRecommendations(factors, totalValue, confidence);

    return {
      estimatedValue: Math.max(0, Math.round(totalValue)),
      methodology: 'Hybrid Valuation Model (Revenue + Assets + IP + Team + Market)',
      confidence,
      breakdown: {
        revenueMultiple: Math.round(revenueValue),
        assetValue: Math.round(assetValue),
        ipValue: Math.round(ipValue),
        teamValue: Math.round(teamValue),
        marketPotential: Math.round(marketPotential),
        debtAdjustment: Math.round(debtAdjustment)
      },
      recommendations
    };
  }

  static calculateFinancialBreakdown(
    askingPrice: number,
    currentLoans: number,
    monthlyRevenue: number,
    monthlyExpenses: number
  ) {
    const totalDebt = currentLoans;
    const netProfit = askingPrice - totalDebt;
    const loanSettlement = Math.min(askingPrice, totalDebt);
    const founderProfit = Math.max(0, askingPrice - loanSettlement);

    // Calculate monthly profit/loss
    const monthlyProfit = monthlyRevenue - monthlyExpenses;

    return {
      totalDebt,
      netProfit,
      loanSettlement,
      founderProfit,
      monthlyProfit,
      profitMargin: monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0
    };
  }

  static getOptimalAskingPrice(idea: StartupIdea): number {
    const factors: ValuationFactors = {
      monthlyRevenue: idea.monthlyRevenue,
      monthlyExpenses: idea.monthlyExpenses,
      assets: idea.assets,
      currentLoans: idea.currentLoans,
      teamSize: idea.teamSize,
      timeInBusiness: idea.timeInBusiness,
      marketSize: idea.marketSize,
      customerCount: idea.traction.customers,
      revenueGrowth: idea.traction.growth,
      intellectualPropertyCount: idea.intellectualProperty.length
    };

    const valuation = this.calculateValuation(factors, idea.industry);
    
    // Set asking price at 85-95% of estimated value to attract buyers
    const askingPrice = Math.round(valuation.estimatedValue * 0.9);
    
    // Ensure asking price covers at least 80% of loans
    const minimumPrice = Math.round(idea.currentLoans * 0.8);
    
    return Math.max(askingPrice, minimumPrice);
  }

  private static getIndustryMultiplier(industry: string): number {
    const normalizedIndustry = industry.toLowerCase().replace(/[^a-z]/g, '');
    return this.INDUSTRY_MULTIPLIERS[normalizedIndustry] || this.INDUSTRY_MULTIPLIERS['default'];
  }

  private static getRevenueMultiple(timeInBusiness: number, growth: number): number {
    let baseMultiple = 2.5;

    // Adjust for business age
    if (timeInBusiness < 1) baseMultiple *= 0.7;
    else if (timeInBusiness < 2) baseMultiple *= 0.85;
    else if (timeInBusiness > 5) baseMultiple *= 1.2;

    // Adjust for growth rate
    if (growth > 50) baseMultiple *= 1.5;
    else if (growth > 25) baseMultiple *= 1.3;
    else if (growth > 10) baseMultiple *= 1.1;
    else if (growth < 0) baseMultiple *= 0.8;

    return baseMultiple;
  }

  private static calculateConfidence(factors: ValuationFactors, totalValue: number): number {
    let confidence = 50; // Base confidence

    // Revenue consistency
    if (factors.monthlyRevenue > 0 && factors.monthlyExpenses < factors.monthlyRevenue) {
      confidence += 20;
    }

    // Business age
    if (factors.timeInBusiness > 2) confidence += 15;
    else if (factors.timeInBusiness > 1) confidence += 10;

    // Growth rate
    if (factors.revenueGrowth > 20) confidence += 10;
    else if (factors.revenueGrowth > 0) confidence += 5;

    // Customer base
    if (factors.customerCount > 100) confidence += 10;
    else if (factors.customerCount > 50) confidence += 5;

    // Intellectual property
    if (factors.intellectualPropertyCount > 0) confidence += 5;

    // Assets
    if (factors.assets > factors.currentLoans) confidence += 10;

    return Math.min(95, Math.max(20, confidence));
  }

  private static generateRecommendations(
    factors: ValuationFactors, 
    totalValue: number, 
    confidence: number
  ): string[] {
    const recommendations: string[] = [];

    if (confidence < 50) {
      recommendations.push('Consider improving financial records and increasing revenue to boost valuation confidence');
    }

    if (factors.monthlyExpenses >= factors.monthlyRevenue) {
      recommendations.push('Focus on reducing expenses or increasing revenue to improve profitability');
    }

    if (factors.currentLoans > totalValue * 0.5) {
      recommendations.push('High debt ratio may deter buyers - consider debt restructuring before listing');
    }

    if (factors.intellectualPropertyCount === 0) {
      recommendations.push('Consider protecting intellectual property to increase business value');
    }

    if (factors.customerCount < 20) {
      recommendations.push('Build a larger customer base to demonstrate market validation');
    }

    if (factors.revenueGrowth < 5) {
      recommendations.push('Implement growth strategies to increase business attractiveness');
    }

    if (recommendations.length === 0) {
      recommendations.push('Business shows strong fundamentals for a successful sale');
    }

    return recommendations;
  }

  static validateIdeaForListing(idea: Partial<StartupIdea>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!idea.title || idea.title.length < 10) {
      errors.push('Title must be at least 10 characters long');
    }

    if (!idea.description || idea.description.length < 50) {
      errors.push('Description must be at least 50 characters long');
    }

    if (!idea.industry) {
      errors.push('Industry is required');
    }

    if (!idea.founderName || idea.founderName.length < 3) {
      errors.push('Founder name is required');
    }

    if (!idea.contactEmail || !idea.contactEmail.includes('@')) {
      errors.push('Valid contact email is required');
    }

    if (idea.currentLoans === undefined || idea.currentLoans < 0) {
      errors.push('Current loan amount must be a positive number');
    }

    if (idea.monthlyRevenue === undefined || idea.monthlyRevenue < 0) {
      errors.push('Monthly revenue must be a positive number');
    }

    if (idea.monthlyExpenses === undefined || idea.monthlyExpenses < 0) {
      errors.push('Monthly expenses must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
