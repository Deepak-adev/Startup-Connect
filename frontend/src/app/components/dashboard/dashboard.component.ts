import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { StartupService, Startup } from '../../services/startup.service';
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

  startups: Startup[] = [];
  isLoadingStartups: boolean = true;

  constructor(
    private socketService: SocketService,
    private startupService: StartupService
  ) {}

  ngOnInit() {
    this.loadStartups();

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
              this.loadStartups();
            }
          }
        } catch (e) {
          // ignore parsing errors here
        }
      }
    );
  }

  loadStartups() {
    this.isLoadingStartups = true;
    this.startupService.getStartups(this.industry).subscribe({
      next: (data) => {
        this.startups = data;
        this.isLoadingStartups = false;
      },
      error: (err) => {
        console.error('Failed to load startups from MongoDB:', err);
        this.isLoadingStartups = false;
      }
    });
  }

  setIndustry(ind: string) {
    this.industry = ind;
    this.loadStartups();
  }

  onStartupCreated(newStartup: Startup) {
    this.loadStartups();
    this.currentView = 'dashboard';
  }
}
