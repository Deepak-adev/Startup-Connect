import { LossReason, StartupAnalysis, SuccessfulPartner } from '../types';

export class PartnerMatchingService {
  private static calculateCategoryMatch(lossReasons: LossReason[], partner: SuccessfulPartner): number {
    const categoryScores = {
      operational: 0.3,
      financial: 0.35,
      market: 0.2,
      strategic: 0.1,
      technical: 0.05
    };

    let totalScore = 0;
    let maxPossibleScore = 0;

    lossReasons.forEach(reason => {
      const categoryWeight = categoryScores[reason.category] || 0.1;
      const severityWeight = reason.severity === 'critical' ? 1.5 : 
                           reason.severity === 'high' ? 1.2 : 
                           reason.severity === 'medium' ? 1 : 0.8;
      
      maxPossibleScore += categoryWeight * severityWeight;
      
      if (partner.canHelpWith.some(help => 
        help.toLowerCase().includes(reason.category) || 
        reason.solutions.some(solution => 
          solution.toLowerCase().includes(help.toLowerCase())
        )
      )) {
        totalScore += categoryWeight * severityWeight;
      }
    });

    return maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
  }

  private static calculateIndustryMatch(startupIndustry: string, partnerIndustry: string): number {
    if (startupIndustry.toLowerCase() === partnerIndustry.toLowerCase()) {
      return 1.0;
    }
    
    const relatedIndustries = {
      'technology': ['software', 'fintech', 'healthtech', 'edtech'],
      'manufacturing': ['textile', 'automotive', 'electronics'],
      'retail': ['ecommerce', 'fashion', 'consumer goods'],
      'agriculture': ['food processing', 'agritech'],
      'healthcare': ['pharmaceuticals', 'medical devices'],
      'finance': ['banking', 'insurance', 'investment']
    };

    for (const [main, related] of Object.entries(relatedIndustries)) {
      if (related.includes(startupIndustry.toLowerCase()) && 
          related.includes(partnerIndustry.toLowerCase())) {
        return 0.7;
      }
    }

    return 0.3;
  }

  private static calculateFinancialMatch(startup: StartupAnalysis, partner: SuccessfulPartner): number {
    const { currentRevenue, targetRevenue } = startup;
    const { investmentRange } = partner.partnershipTerms;
    
    const neededInvestment = targetRevenue - currentRevenue;
    
    if (neededInvestment >= investmentRange.min && neededInvestment <= investmentRange.max) {
      return 1.0;
    }
    
    if (neededInvestment < investmentRange.min) {
      return 0.6;
    }
    
    const overage = (neededInvestment - investmentRange.max) / investmentRange.max;
    return Math.max(0.2, 1 - overage);
  }

  private static calculateExpertiseMatch(operationalChallenges: string[], partner: SuccessfulPartner): number {
    if (operationalChallenges.length === 0) return 0.5;
    
    let matches = 0;
    operationalChallenges.forEach(challenge => {
      if (partner.expertise.some(exp => 
        challenge.toLowerCase().includes(exp.toLowerCase()) ||
        exp.toLowerCase().includes(challenge.toLowerCase())
      )) {
        matches++;
      }
    });

    return matches / operationalChallenges.length;
  }

  private static calculateSuccessScore(partner: SuccessfulPartner): number {
    const { successMetrics } = partner;
    return (
      successMetrics.revenueGrowth * 0.3 +
      successMetrics.profitability * 0.3 +
      successMetrics.marketShare * 0.2 +
      successMetrics.operationalEfficiency * 0.2
    );
  }

  static findMatchingPartners(startup: StartupAnalysis, partners: SuccessfulPartner[]): SuccessfulPartner[] {
    return partners
      .map(partner => {
        const categoryMatch = this.calculateCategoryMatch(startup.lossReasons, partner);
        const industryMatch = this.calculateIndustryMatch(startup.industry, partner.industry);
        const financialMatch = this.calculateFinancialMatch(startup, partner);
        const expertiseMatch = this.calculateExpertiseMatch(startup.operationalChallenges, partner);
        const successScore = this.calculateSuccessScore(partner);

        const overallScore = (
          categoryMatch * 0.35 +
          industryMatch * 0.2 +
          financialMatch * 0.2 +
          expertiseMatch * 0.15 +
          successScore * 0.1
        );

        return {
          ...partner,
          matchScore: Math.round(overallScore * 100)
        };
      })
      .filter(partner => partner.matchScore >= 30)
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  static getPartnersForSpecificLoss(lossReasonId: string, startup: StartupAnalysis, partners: SuccessfulPartner[]): SuccessfulPartner[] {
    const specificLossReason = startup.lossReasons.find(reason => reason.id === lossReasonId);
    if (!specificLossReason) return [];

    return partners
      .map(partner => {
        let score = 0;

        if (partner.canHelpWith.some(help => 
          help.toLowerCase().includes(specificLossReason.category) ||
          specificLossReason.solutions.some(solution => 
            solution.toLowerCase().includes(help.toLowerCase())
          )
        )) {
          score = 0.6;
        }

        if (partner.expertise.some(exp => 
          specificLossReason.description.toLowerCase().includes(exp.toLowerCase())
        )) {
          score += 0.3;
        }

        const successScore = this.calculateSuccessScore(partner);
        score += successScore * 0.1;

        return {
          ...partner,
          matchScore: Math.round(score * 100)
        };
      })
      .filter(partner => partner.matchScore >= 40)
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}
