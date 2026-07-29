import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partner-matching',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partner-matching.component.html',
  styleUrls: ['./partner-matching.component.css']
})
export class PartnerMatchingComponent {
  @Input() industry: string = 'All';
  
  partners = [
    { name: 'Tech Innovators LLC', match: 98, desc: 'Perfect match for software integration needs.', industry: 'Technology' },
    { name: 'Global Supply Co', match: 85, desc: 'Robust logistics and warehousing.', industry: 'Manufacturing' },
    { name: 'Acme HealthTech', match: 72, desc: 'Medical device distribution network.', industry: 'Healthcare' }
  ];

  get filteredPartners() {
    if (this.industry === 'All') return this.partners;
    return this.partners.filter(p => p.industry.toLowerCase() === this.industry.toLowerCase());
  }
}
