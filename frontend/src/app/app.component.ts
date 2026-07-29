import { Component } from '@angular/core';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatInterfaceComponent, DashboardComponent],
  template: `
    <app-dashboard></app-dashboard>
    <app-chat-interface></app-chat-interface>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
