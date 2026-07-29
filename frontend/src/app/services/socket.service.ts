import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

export interface RealtimeStartup {
  id?: string;
  name: string;
  industry: string;
  description: string;
  funding?: string;
  matchScore?: number;
  location?: string;
}

export interface RealtimePartnerConnection {
  partnerId: string;
  partnerName: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly SERVER_URL = 'http://localhost:9092';

  // Shared hot observables for real-time events across all subscribers
  private startupCreated$: Observable<RealtimeStartup>;
  private partnerConnected$: Observable<RealtimePartnerConnection>;
  private connectionStatus$ = new Subject<'connected' | 'disconnected'>();

  public isConnected: boolean = false;

  constructor() {
    this.socket = io(this.SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });

    this.socket.on('connect', () => {
      console.log('[SocketService] ✅ Connected to AGUI Backend via Socket.IO');
      this.isConnected = true;
      this.connectionStatus$.next('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('[SocketService] ⚠️ Disconnected from AGUI Backend - attempting reconnect...');
      this.isConnected = false;
      this.connectionStatus$.next('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.warn('[SocketService] Connection error:', error.message);
    });

    // Create shared hot observables (multicast to all subscribers concurrently)
    this.startupCreated$ = new Observable<RealtimeStartup>(observer => {
      this.socket.on('startupCreated', (data: RealtimeStartup) => {
        console.log('[SocketService] 🚀 Real-time startup created event received:', data.name);
        observer.next(data);
      });
      return () => this.socket.off('startupCreated');
    }).pipe(share());

    this.partnerConnected$ = new Observable<RealtimePartnerConnection>(observer => {
      this.socket.on('partnerConnected', (data: RealtimePartnerConnection) => {
        console.log('[SocketService] 🤝 Real-time partner connection event received:', data.partnerName);
        observer.next(data);
      });
      return () => this.socket.off('partnerConnected');
    }).pipe(share());
  }

  /** Emit an event to the backend */
  public sendMessage(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  /** Listen to any event from the backend */
  public getMessage(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.off(event);
      };
    });
  }

  /** Real-time startup creation stream (shared across all subscribers) */
  public onStartupCreated(): Observable<RealtimeStartup> {
    return this.startupCreated$;
  }

  /** Real-time partner connection stream (shared across all subscribers) */
  public onPartnerConnected(): Observable<RealtimePartnerConnection> {
    return this.partnerConnected$;
  }

  /** Connection status stream */
  public onConnectionStatus(): Observable<'connected' | 'disconnected'> {
    return this.connectionStatus$.asObservable();
  }
}
