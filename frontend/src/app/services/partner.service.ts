import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Partner {
  id: string;
  name: string;
  industry: string;
  match: number;
  desc: string;
  verified?: boolean;
  location?: string;
  connected?: boolean;
}

export interface ConnectionRequest {
  partnerId: string;
  partnerName: string;
  message: string;
  senderEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private apiUrl = 'http://localhost:8080/api/partners';

  constructor(private http: HttpClient) {}

  getMatchingPartners(industry: string): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${this.apiUrl}/match?industry=${encodeURIComponent(industry)}`);
  }

  connectWithPartner(request: ConnectionRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/connect`, request);
  }
}
