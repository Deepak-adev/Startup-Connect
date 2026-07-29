import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { StartupFormComponent } from '../startup-form/startup-form.component';
import { PartnerMatchingComponent } from '../partner-matching/partner-matching.component';
import { MarketAnalysisComponent } from '../market-analysis/market-analysis.component';
import { PitchDeckComponent } from '../pitch-deck/pitch-deck.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StartupFormComponent, PartnerMatchingComponent, MarketAnalysisComponent, PitchDeckComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentView: string = 'dashboard';
  industry: string = 'All';

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.getMessage('chatReply').subscribe(
      (response: any) => {
        try {
          const jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;
          if (jsonResponse.navigation && jsonResponse.navigation.params) {
            if (jsonResponse.navigation.params.view) {
              this.currentView = jsonResponse.navigation.params.view;
            }
            if (jsonResponse.navigation.params.industry) {
              this.industry = jsonResponse.navigation.params.industry;
            }
          }
        } catch (e) {
          // ignore parsing errors here
        }
      }
    );
  }
}
