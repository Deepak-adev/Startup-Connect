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
  isSocketConnected: boolean = false;

  // Real-time toast
  realtimeToast: string = '';
  private toastTimer: any;

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

    // --- Real-time: new startup created by any connected client ---
    this.socketService.onStartupCreated().subscribe((newStartup: any) => {
      const exists = this.startups.some(s => s.id === newStartup.id);
      if (!exists) {
        this.startups = [newStartup, ...this.startups];
        this.showToast(`🚀 New startup joined: ${newStartup.name}`);
      }
    });

    // --- Real-time: socket connection status ---
    this.socketService.onConnectionStatus().subscribe(status => {
      this.isSocketConnected = status === 'connected';
    });
    this.isSocketConnected = this.socketService.isConnected;
  }

  showToast(message: string) {
    this.realtimeToast = message;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.realtimeToast = ''; }, 4000);
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
    // The real-time socket broadcast will handle the grid update for all clients.
    // Switch view back to dashboard for the submitter.
    this.currentView = 'dashboard';
    this.showToast(`✅ "${newStartup.name}" saved to MongoDB!`);
  }
}
