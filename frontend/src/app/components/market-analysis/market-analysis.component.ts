import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketService, MarketData } from '../../services/market.service';

@Component({
  selector: 'app-market-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-analysis.component.html',
  styleUrls: ['./market-analysis.component.css']
})
export class MarketAnalysisComponent implements OnChanges {
  @Input() industry: string = 'All';

  marketData: MarketData | null = null;
  isLoading: boolean = true;
  isGeneratingBrief: boolean = false;
  showBriefModal: boolean = false;

  constructor(private marketService: MarketService) {}

  ngOnInit() {
    this.loadMarketData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['industry'] && !changes['industry'].firstChange) {
      this.loadMarketData();
    }
  }

  loadMarketData() {
    this.isLoading = true;
    this.marketService.getMarketInsights(this.industry).subscribe({
      next: (data) => {
        this.marketData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load market insights:', err);
        // Fallback default data
        this.marketData = {
          industry: this.industry,
          tam: '$120B',
          sam: '$35B',
          som: '$1.2B',
          tamTrend: '+14%',
          samTrend: '+8%',
          somTrend: '+22%',
          chartPoints: [10, 25, 40, 55, 75, 95, 120],
          drivers: ['AI Automation', 'Cloud Microservices', 'Regulatory Compliance'],
          aiBrief: 'Market indicators reflect strong double-digit growth driven by modern software adoption.'
        };
        this.isLoading = false;
      }
    });
  }

  generateAIBrief() {
    this.isGeneratingBrief = true;
    setTimeout(() => {
      this.isGeneratingBrief = false;
      this.showBriefModal = true;
    }, 1200);
  }

  closeBriefModal() {
    this.showBriefModal = false;
  }
}
