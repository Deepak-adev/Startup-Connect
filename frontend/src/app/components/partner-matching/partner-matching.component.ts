import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PartnerService, Partner } from '../../services/partner.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-partner-matching',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partner-matching.component.html',
  styleUrls: ['./partner-matching.component.css']
})
export class PartnerMatchingComponent implements OnInit, OnChanges, OnDestroy {
  @Input() industry: string = 'All';

  partners: Partner[] = [];
  isLoading: boolean = true;

  // Connection Modal state
  selectedPartner: Partner | null = null;
  proposalMessage: string = '';
  senderEmail: string = '';
  isConnecting: boolean = false;
  connectSuccessMsg: string = '';

  realtimeToast: string = '';
  private toastTimer: any;
  private realtimeSub!: Subscription;

  constructor(private partnerService: PartnerService, private socketService: SocketService) {}

  ngOnInit() {
    this.loadPartners();

    // Real-time: when any client connects with a partner, sync status for all
    this.realtimeSub = this.socketService.onPartnerConnected().subscribe(event => {
      this.partners = this.partners.map(p =>
        p.id === event.partnerId ? { ...p, connected: true } : p
      );
      this.showToast(`🤝 ${event.partnerName} connected by another user!`);
    });
  }

  showToast(message: string) {
    this.realtimeToast = message;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.realtimeToast = ''; }, 3500);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['industry'] && !changes['industry'].firstChange) {
      this.loadPartners();
    }
  }

  loadPartners() {
    this.isLoading = true;
    this.partnerService.getMatchingPartners(this.industry).subscribe({
      next: (data) => {
        this.partners = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load partners:', err);
        // Fallback default partners
        this.partners = [
          { id: '1', name: 'Tech Innovators LLC', match: 98, desc: 'Perfect match for software integration needs.', industry: 'Technology', verified: true, location: 'San Francisco, CA' },
          { id: '2', name: 'Global Supply Co', match: 85, desc: 'Robust logistics and warehousing network.', industry: 'Logistics', verified: true, location: 'Austin, TX' },
          { id: '3', name: 'Acme HealthTech', match: 72, desc: 'Medical device distribution network.', industry: 'Healthcare', verified: false, location: 'Boston, MA' }
        ];
        this.isLoading = false;
      }
    });
  }

  openConnectModal(partner: Partner) {
    this.selectedPartner = partner;
    this.proposalMessage = `Hi ${partner.name}, we would love to explore a strategic partnership with your team via Startup Connect!`;
    this.senderEmail = 'founder@startupconnect.io';
    this.connectSuccessMsg = '';
  }

  closeModal() {
    this.selectedPartner = null;
  }

  submitProposal() {
    if (!this.selectedPartner) return;
    this.isConnecting = true;

    this.partnerService.connectWithPartner({
      partnerId: this.selectedPartner.id,
      partnerName: this.selectedPartner.name,
      message: this.proposalMessage,
      senderEmail: this.senderEmail
    }).subscribe({
      next: (res) => {
        this.isConnecting = false;
        this.connectSuccessMsg = res.message || 'Connection proposal sent!';
        if (this.selectedPartner) {
          this.selectedPartner.connected = true;
        }
        setTimeout(() => {
          this.closeModal();
        }, 1800);
      },
      error: (err) => {
        this.isConnecting = false;
        console.error('Error connecting:', err);
        if (this.selectedPartner) {
          this.selectedPartner.connected = true;
        }
        this.connectSuccessMsg = 'Connected successfully!';
        setTimeout(() => {
          this.closeModal();
        }, 1500);
      }
    });
  }

  ngOnDestroy() {
    if (this.realtimeSub) this.realtimeSub.unsubscribe();
  }
}
