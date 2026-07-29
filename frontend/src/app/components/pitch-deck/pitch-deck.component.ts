import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Slide {
  title: string;
  subtitle: string;
  content: string;
  icon: string;
  gradient: string;
  bulletPoints?: string[];
}

@Component({
  selector: 'app-pitch-deck',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pitch-deck.component.html',
  styleUrls: ['./pitch-deck.component.css']
})
export class PitchDeckComponent {
  deckTitle: string = 'Startup Connect Pitch Deck';
  
  slides: Slide[] = [
    { 
      title: '1. The Problem', 
      subtitle: 'Fragmented Ecosystems',
      content: 'Early-stage founders spend 60% of their time seeking ecosystem partners and investors through disconnected channels with low conversion.', 
      icon: '⚡',
      gradient: 'from-indigo-600 to-blue-700',
      bulletPoints: ['Slow partner discovery', 'Lack of real-time market data', 'Manual pitch deck creation']
    },
    { 
      title: '2. Our Solution', 
      subtitle: 'AGUI Autonomous Co-Pilot',
      content: 'Startup Connect bridges founders and partners using AI intent navigation, automated matching algorithms, and MongoDB real-time synchronization.', 
      icon: '🚀',
      gradient: 'from-emerald-600 to-teal-700',
      bulletPoints: ['Direct MongoDB integration', 'Real-time AGUI navigation', 'Automated partner scoring']
    },
    { 
      title: '3. Market Opportunity', 
      subtitle: '$140B Addressable Market',
      content: 'Accelerating digital startup incubation across Tech, CleanTech, Healthcare, and Fintech vectors globally.', 
      icon: '📈',
      gradient: 'from-purple-600 to-pink-700',
      bulletPoints: ['$140B Global TAM', '$40B SAM Target', '+22% CAGR opportunity']
    },
    { 
      title: '4. Business Model', 
      subtitle: 'SaaS & Matchmaking Fees',
      content: 'Tiered subscription for venture partners, transaction fees on verified match connections, and enterprise AGUI customization.', 
      icon: '💎',
      gradient: 'from-amber-600 to-orange-700',
      bulletPoints: ['Freemium for founders', 'Enterprise Partner tiers', 'Success-based matchmaking fee']
    }
  ];

  // Slide Presenter Modal state
  activeSlideIndex: number = 0;
  isPresenting: boolean = false;

  // Add Slide state
  showAddModal: boolean = false;
  newSlideTitle: string = '';
  newSlideSubtitle: string = '';
  newSlideContent: string = '';

  openPresenter(index: number = 0) {
    this.activeSlideIndex = index;
    this.isPresenting = true;
  }

  closePresenter() {
    this.isPresenting = false;
  }

  nextSlide() {
    if (this.activeSlideIndex < this.slides.length - 1) {
      this.activeSlideIndex++;
    }
  }

  prevSlide() {
    if (this.activeSlideIndex > 0) {
      this.activeSlideIndex--;
    }
  }

  exportPDF() {
    window.print();
  }

  openAddModal() {
    this.newSlideTitle = '';
    this.newSlideSubtitle = '';
    this.newSlideContent = '';
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  addSlide() {
    if (!this.newSlideTitle.trim()) return;

    this.slides.push({
      title: `${this.slides.length + 1}. ${this.newSlideTitle}`,
      subtitle: this.newSlideSubtitle || 'Custom Overview',
      content: this.newSlideContent || 'Additional strategic deck point.',
      icon: '✨',
      gradient: 'from-slate-700 to-slate-900',
      bulletPoints: ['Custom point 1', 'Custom point 2']
    });

    this.closeAddModal();
  }
}
