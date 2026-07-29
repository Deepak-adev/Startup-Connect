import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-market-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-analysis.component.html',
  styleUrls: ['./market-analysis.component.css']
})
export class MarketAnalysisComponent {
  @Input() industry: string = 'All';
  
  marketData = [
    { label: 'Total Addressable Market (TAM)', value: '$120B', trend: '+14%' },
    { label: 'Serviceable Available Market (SAM)', value: '$35B', trend: '+8%' },
    { label: 'Serviceable Obtainable Market (SOM)', value: '$1.2B', trend: '+22%' }
  ];
}
