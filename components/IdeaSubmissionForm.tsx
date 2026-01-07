import React, { useState } from 'react';
import { Card, Badge, Button } from './ui';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Building, 
  Target,
  Lightbulb,
  Package,
  CheckCircle,
  AlertTriangle,
  Calculator
} from 'lucide-react';
import { StartupIdea } from '../types';
import { IdeaValuationService, ValuationFactors } from '../services/ideaValuation';
import { IdeaStorageService } from '../services/ideaStorage';

interface IdeaSubmissionFormProps {
  onSubmit?: (idea: StartupIdea) => void;
  onCancel?: () => void;
}

interface FormData {
  // Basic Info
  title: string;
  description: string;
  industry: string;
  founderName: string;
  contactEmail: string;
  
  // Financials
  currentLoans: string;
  monthlyRevenue: string;
  monthlyExpenses: string;
  assets: string;
  
  // Business Details
  teamSize: string;
  timeInBusiness: string;
  marketSize: string;
  competitiveAdvantage: string;
  businessModel: string;
  
  // Traction
  customers: string;
  revenueGrowth: string;
  
  // Intellectual Property
  intellectualProperty: string[];
  
  // Sale Terms
  askingPrice: string;
  negotiation: boolean;
  includesAssets: boolean;
  includesIP: boolean;
  transitionSupport: string;
}

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Food',
  'Manufacturing', 'Transportation', 'Real Estate', 'Media', 'Agriculture',
  'Fashion', 'Consulting', 'Energy', 'Entertainment', 'Sports', 'Travel',
  'Other'
];

const IP_TYPES = [
  'Patent', 'Trademark', 'Copyright', 'Trade Secret', 'Software', 'Design', 'Other'
];

export default function IdeaSubmissionForm({ onSubmit, onCancel }: IdeaSubmissionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    industry: '',
    founderName: '',
    contactEmail: '',
    currentLoans: '',
    monthlyRevenue: '',
    monthlyExpenses: '',
    assets: '',
    teamSize: '',
    timeInBusiness: '',
    marketSize: '',
    competitiveAdvantage: '',
    businessModel: '',
    customers: '',
    revenueGrowth: '',
    intellectualProperty: [],
    askingPrice: '',
    negotiation: true,
    includesAssets: true,
    includesIP: true,
    transitionSupport: '8'
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [valuation, setValuation] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showValuation, setShowValuation] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const calculateValuation = async () => {
    setIsCalculating(true);
    
    // Validate required fields
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsCalculating(false);
      return;
    }

    try {
      const factors: ValuationFactors = {
        monthlyRevenue: parseFloat(formData.monthlyRevenue) || 0,
        monthlyExpenses: parseFloat(formData.monthlyExpenses) || 0,
        assets: parseFloat(formData.assets) || 0,
        currentLoans: parseFloat(formData.currentLoans) || 0,
        teamSize: parseInt(formData.teamSize) || 0,
        timeInBusiness: parseFloat(formData.timeInBusiness) || 0,
        marketSize: parseFloat(formData.marketSize) || 0,
        customerCount: parseInt(formData.customers) || 0,
        revenueGrowth: parseFloat(formData.revenueGrowth) || 0,
        intellectualPropertyCount: formData.intellectualProperty.length
      };

      const valuationResult = IdeaValuationService.calculateValuation(factors, formData.industry);
      const optimalPrice = IdeaValuationService.getOptimalAskingPrice({
        id: 'temp',
        title: formData.title,
        description: formData.description,
        industry: formData.industry,
        founderName: formData.founderName,
        contactEmail: formData.contactEmail,
        currentLoans: factors.currentLoans,
        monthlyRevenue: factors.monthlyRevenue,
        monthlyExpenses: factors.monthlyExpenses,
        assets: factors.assets,
        intellectualProperty: formData.intellectualProperty,
        teamSize: factors.teamSize,
        timeInBusiness: factors.timeInBusiness,
        marketSize: factors.marketSize,
        competitiveAdvantage: formData.competitiveAdvantage,
        businessModel: formData.businessModel,
        traction: {
          customers: factors.customerCount,
          revenue: factors.monthlyRevenue * 12,
          growth: factors.revenueGrowth
        },
        valuation: valuationResult,
        saleTerms: {
          askingPrice: 0,
          negotiation: formData.negotiation,
          includesAssets: formData.includesAssets,
          includesIP: formData.includesIP,
          transitionSupport: parseInt(formData.transitionSupport) || 8
        },
        financialBreakdown: {
          totalDebt: factors.currentLoans,
          netProfit: 0,
          loanSettlement: 0,
          founderProfit: 0
        },
        status: 'active',
        listedDate: new Date().toISOString().split('T')[0],
        views: 0,
        inquiries: 0
      });

      setValuation({
        ...valuationResult,
        optimalPrice,
        financialBreakdown: IdeaValuationService.calculateFinancialBreakdown(
          optimalPrice,
          factors.currentLoans,
          factors.monthlyRevenue,
          factors.monthlyExpenses
        )
      });
      
      setShowValuation(true);
      
      // Auto-fill asking price if not set
      if (!formData.askingPrice || formData.askingPrice === '') {
        handleInputChange('askingPrice', optimalPrice.toString());
      }
      
    } catch (error) {
      setErrors(['Failed to calculate valuation. Please check your inputs.']);
    } finally {
      setIsCalculating(false);
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.title || formData.title.length < 10) {
      errors.push('Title must be at least 10 characters long');
    }

    if (!formData.description || formData.description.length < 50) {
      errors.push('Description must be at least 50 characters long');
    }

    if (!formData.industry) {
      errors.push('Please select an industry');
    }

    if (!formData.founderName || formData.founderName.length < 3) {
      errors.push('Founder name is required');
    }

    if (!formData.contactEmail || !formData.contactEmail.includes('@')) {
      errors.push('Valid contact email is required');
    }

    if (!formData.currentLoans || isNaN(parseFloat(formData.currentLoans))) {
      errors.push('Current loan amount must be a valid number');
    }

    if (!formData.monthlyRevenue || isNaN(parseFloat(formData.monthlyRevenue))) {
      errors.push('Monthly revenue must be a valid number');
    }

    if (!formData.monthlyExpenses || isNaN(parseFloat(formData.monthlyExpenses))) {
      errors.push('Monthly expenses must be a valid number');
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create startup idea object
    const idea: StartupIdea = {
      id: `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      description: formData.description,
      industry: formData.industry,
      founderName: formData.founderName,
      contactEmail: formData.contactEmail,
      currentLoans: parseFloat(formData.currentLoans),
      monthlyRevenue: parseFloat(formData.monthlyRevenue),
      monthlyExpenses: parseFloat(formData.monthlyExpenses),
      assets: parseFloat(formData.assets),
      intellectualProperty: formData.intellectualProperty,
      teamSize: parseInt(formData.teamSize),
      timeInBusiness: parseFloat(formData.timeInBusiness),
      marketSize: parseFloat(formData.marketSize),
      competitiveAdvantage: formData.competitiveAdvantage,
      businessModel: formData.businessModel,
      traction: {
        customers: parseInt(formData.customers),
        revenue: parseFloat(formData.monthlyRevenue) * 12,
        growth: parseFloat(formData.revenueGrowth)
      },
      valuation: valuation || {
        estimated: parseFloat(formData.askingPrice) || 0,
        methodology: 'User-defined',
        confidence: 50
      },
      saleTerms: {
        askingPrice: parseFloat(formData.askingPrice) || 0,
        negotiation: formData.negotiation,
        includesAssets: formData.includesAssets,
        includesIP: formData.includesIP,
        transitionSupport: parseInt(formData.transitionSupport) || 8
      },
      financialBreakdown: valuation?.financialBreakdown || {
        totalDebt: parseFloat(formData.currentLoans),
        netProfit: 0,
        loanSettlement: 0,
        founderProfit: 0
      },
      status: 'pending',
      listedDate: new Date().toISOString().split('T')[0],
      views: 0,
      inquiries: 0
    };

    // Save to local storage directly
    try {
      const savedIdeas = IdeaStorageService.addIdea(idea);
      console.log('Idea saved to local storage:', idea);
      onSubmit?.(idea);
    } catch (error) {
      console.error('Failed to save idea to local storage:', error);
      setErrors(['Failed to save your idea. Please try again.']);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const addIntellectualProperty = (type: string) => {
    if (!formData.intellectualProperty.includes(type)) {
      handleInputChange('intellectualProperty', [...formData.intellectualProperty, type]);
    }
  };

  const removeIntellectualProperty = (type: string) => {
    handleInputChange('intellectualProperty', formData.intellectualProperty.filter(ip => ip !== type));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-white mb-2">List Your Startup Idea</h1>
        <p className="text-slate-400">
          Get a professional valuation and find the right buyer for your business
        </p>
      </div>

      {errors.length > 0 && (
        <Card className="border-red-500/30 bg-red-500/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-400 mt-0.5" size={20} />
            <div>
              <h3 className="text-white font-semibold mb-2">Please fix the following errors:</h3>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-300 text-sm">• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target size={20} className="text-indigo-400" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Startup Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter your startup title"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Industry *
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="">Select Industry</option>
                {INDUSTRIES.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your startup idea in detail"
                rows={4}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Founder Name *
              </label>
              <input
                type="text"
                value={formData.founderName}
                onChange={(e) => handleInputChange('founderName', e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </Card>

        {/* Financial Information */}
        <Card className="border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign size={20} className="text-green-400" />
            Financial Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Loans ($) *
              </label>
              <input
                type="number"
                value={formData.currentLoans}
                onChange={(e) => handleInputChange('currentLoans', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Monthly Revenue ($) *
              </label>
              <input
                type="number"
                value={formData.monthlyRevenue}
                onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Monthly Expenses ($) *
              </label>
              <input
                type="number"
                value={formData.monthlyExpenses}
                onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Assets Value ($)
              </label>
              <input
                type="number"
                value={formData.assets}
                onChange={(e) => handleInputChange('assets', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </Card>

        {/* Business Details */}
        <Card className="border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building size={20} className="text-blue-400" />
            Business Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Team Size
              </label>
              <input
                type="number"
                value={formData.teamSize}
                onChange={(e) => handleInputChange('teamSize', e.target.value)}
                placeholder="1"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Time in Business (years)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.timeInBusiness}
                onChange={(e) => handleInputChange('timeInBusiness', e.target.value)}
                placeholder="1"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Market Size ($)
              </label>
              <input
                type="number"
                value={formData.marketSize}
                onChange={(e) => handleInputChange('marketSize', e.target.value)}
                placeholder="1000000"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Number of Customers
              </label>
              <input
                type="number"
                value={formData.customers}
                onChange={(e) => handleInputChange('customers', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Revenue Growth Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.revenueGrowth}
                onChange={(e) => handleInputChange('revenueGrowth', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Business Model
              </label>
              <input
                type="text"
                value={formData.businessModel}
                onChange={(e) => handleInputChange('businessModel', e.target.value)}
                placeholder="e.g., SaaS, E-commerce, B2B"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Competitive Advantage
              </label>
              <textarea
                value={formData.competitiveAdvantage}
                onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
                placeholder="What makes your business unique?"
                rows={3}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Intellectual Property */}
        <Card className="border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb size={20} className="text-yellow-400" />
            Intellectual Property
          </h3>
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {IP_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addIntellectualProperty(type)}
                  disabled={formData.intellectualProperty.includes(type)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    formData.intellectualProperty.includes(type)
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:bg-slate-700/50'
                  }`}
                >
                  + {type}
                </button>
              ))}
            </div>
            
            {formData.intellectualProperty.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.intellectualProperty.map(ip => (
                  <Badge key={ip} variant="default" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                    {ip}
                    <button
                      type="button"
                      onClick={() => removeIntellectualProperty(ip)}
                      className="ml-2 text-indigo-400 hover:text-indigo-300"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Valuation Section */}
        <Card className="border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calculator size={20} className="text-purple-400" />
              Valuation & Pricing
            </h3>
            <Button
              type="button"
              variant="secondary"
              onClick={calculateValuation}
              disabled={isCalculating}
              className="flex items-center gap-2"
            >
              <Calculator size={16} />
              {isCalculating ? 'Calculating...' : 'Calculate Valuation'}
            </Button>
          </div>

          {showValuation && valuation && (
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-1">Estimated Value</div>
                  <div className="text-xl font-bold text-blue-400">
                    {formatCurrency(valuation.estimated)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-1">Optimal Price</div>
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(valuation.optimalPrice)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-1">Confidence</div>
                  <div className="text-xl font-bold text-purple-400">
                    {valuation.confidence}%
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Financial Breakdown</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Loan Settlement:</span>
                    <span className="text-white">{formatCurrency(valuation.financialBreakdown.loanSettlement)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Founder Profit:</span>
                    <span className="text-green-400">{formatCurrency(valuation.financialBreakdown.founderProfit)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Asking Price ($)
              </label>
              <input
                type="number"
                value={formData.askingPrice}
                onChange={(e) => handleInputChange('askingPrice', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Transition Support (weeks)
              </label>
              <input
                type="number"
                value={formData.transitionSupport}
                onChange={(e) => handleInputChange('transitionSupport', e.target.value)}
                placeholder="8"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.negotiation}
                onChange={(e) => handleInputChange('negotiation', e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50"
              />
              <span className="text-sm text-slate-300">Price is negotiable</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.includesAssets}
                onChange={(e) => handleInputChange('includesAssets', e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50"
              />
              <span className="text-sm text-slate-300">Include business assets</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.includesIP}
                onChange={(e) => handleInputChange('includesIP', e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50"
              />
              <span className="text-sm text-slate-300">Include intellectual property</span>
            </label>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            Submit for Listing
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
