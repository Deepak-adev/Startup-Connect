import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

interface ChatMessage {
  text: string;
  isUser: boolean;
  isProcessing?: boolean;
}

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css']
})
export class ChatInterfaceComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  userInput: string = '';
  isProcessing: boolean = false;
  private socketSubscription!: Subscription;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.messages.push({
      text: "Hello! I am AGUI, your Startup Connect co-pilot. How can I help you today?",
      isUser: false
    });

    this.socketSubscription = this.socketService.getMessage('chatReply').subscribe(
      (response: any) => {
        this.isProcessing = false;
        
        // Remove processing message if it exists
        this.messages = this.messages.filter(m => !m.isProcessing);
        
        // Parse AGUI JSON response
        try {
          const jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;
          if (jsonResponse.message) {
            this.messages.push({
              text: jsonResponse.message,
              isUser: false
            });
          }
        } catch (e) {
          // Fallback if not valid JSON
          this.messages.push({
            text: response.toString(),
            isUser: false
          });
        }
      }
    );
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const text = this.userInput;
    this.messages.push({
      text: text,
      isUser: true
    });

    this.isProcessing = true;
    this.messages.push({
      text: "...",
      isUser: false,
      isProcessing: true
    });

    this.socketService.sendMessage('chatMessage', text);
    this.userInput = '';
  }

  ngOnDestroy() {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }
}
