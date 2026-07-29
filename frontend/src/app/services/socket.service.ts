import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly SERVER_URL = 'http://localhost:9092'; // Must match Spring Boot Socket.IO port

  constructor() {
    this.socket = io(this.SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to AGUI Backend via Socket.IO');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from AGUI Backend');
    });
  }

  // Emit an event to the backend
  public sendMessage(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Listen to an event from the backend
  public getMessage(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
      // Handle cleanup if the observer unsubscribes
      return () => {
        this.socket.off(event);
      };
    });
  }
}
