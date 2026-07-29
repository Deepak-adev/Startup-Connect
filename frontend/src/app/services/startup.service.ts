import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Startup {
  id?: string;
  name: string;
  industry: string;
  description: string;
  weakness?: string;
  revenue?: number;
  funding?: string;
  matchScore?: number;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  private apiUrl = 'http://localhost:8080/api/startups';

  constructor(private http: HttpClient) {}

  getStartups(industry?: string): Observable<Startup[]> {
    if (industry && industry !== 'All') {
      return this.http.get<Startup[]>(`${this.apiUrl}?industry=${encodeURIComponent(industry)}`);
    }
    return this.http.get<Startup[]>(this.apiUrl);
  }

  getStartupById(id: string): Observable<Startup> {
    return this.http.get<Startup>(`${this.apiUrl}/${id}`);
  }

  addStartup(startup: Startup): Observable<Startup> {
    return this.http.post<Startup>(this.apiUrl, startup);
  }
}
