import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-startup-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './startup-form.component.html',
  styleUrls: ['./startup-form.component.css']
})
export class StartupFormComponent {
  startupName: string = '';
  industry: string = '';
  weakness: string = '';
  revenue: number = 0;

  submitForm() {
    console.log('Form submitted:', { name: this.startupName, industry: this.industry });
    // In a real app, this would emit an event or call a service to save to MongoDB
  }
}
