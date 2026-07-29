import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MarketData {
  industry: string;
  tam: string;
  sam: string;
  som: string;
  tamTrend: string;
  samTrend: string;
  somTrend: string;
  chartPoints: number[];
  drivers: string[];
  aiBrief: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private apiUrl = 'http://localhost:8080/api/market';

  constructor(private http: HttpClient) {}

  getMarketInsights(industry: string): Observable<MarketData> {
    return this.http.get<MarketData>(`${this.apiUrl}/insights?industry=${encodeURIComponent(industry)}`);
  }
}
