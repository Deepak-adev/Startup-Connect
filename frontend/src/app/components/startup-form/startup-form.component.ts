import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StartupService, Startup } from '../../services/startup.service';

@Component({
  selector: 'app-startup-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './startup-form.component.html',
  styleUrls: ['./startup-form.component.css']
})
export class StartupFormComponent {
  startupName: string = '';
  industry: string = 'Technology';
  weakness: string = '';
  revenue: number = 100000;
  funding: string = '$500K Seed';
  location: string = 'San Francisco, CA';
  description: string = '';

  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  @Output() startupCreated = new EventEmitter<Startup>();

  constructor(private startupService: StartupService) {}

  submitForm() {
    if (!this.startupName.trim()) {
      this.errorMessage = 'Please provide a startup name.';
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const newStartup: Startup = {
      name: this.startupName,
      industry: this.industry,
      description: this.description || `${this.startupName} is an innovative company in ${this.industry}.`,
      weakness: this.weakness,
      revenue: this.revenue,
      funding: this.funding,
      location: this.location
    };

    this.startupService.addStartup(newStartup).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.successMessage = `Successfully saved ${created.name} to MongoDB database!`;
        this.startupCreated.emit(created);
        // Reset form
        this.startupName = '';
        this.weakness = '';
        this.description = '';
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error saving startup:', err);
        this.errorMessage = 'Failed to save to MongoDB. Is the backend running?';
      }
    });
  }
}
