import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pitch-deck',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pitch-deck.component.html',
  styleUrls: ['./pitch-deck.component.css']
})
export class PitchDeckComponent {
  slides = [
    { title: 'The Problem', content: 'Current supply chains are slow and fragmented.', image: 'https://via.placeholder.com/800x450/4F46E5/ffffff?text=The+Problem' },
    { title: 'Our Solution', content: 'An AI-driven logistics aggregator.', image: 'https://via.placeholder.com/800x450/10B981/ffffff?text=Our+Solution' },
    { title: 'Market Size', content: '$120B TAM by 2028.', image: 'https://via.placeholder.com/800x450/F59E0B/ffffff?text=Market+Size' }
  ];
}
