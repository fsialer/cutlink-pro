import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LinkService {
    private apiUrl = 'http://localhost:4000/v1/urls'; // Ajustar según backend

    constructor(private http: HttpClient) { }

    getOriginalUrl(code: string): Observable<{ long_url: string }> {
        return this.http.get<{ long_url: string }>(`${this.apiUrl}/public/${code}`);
    }

    shortenUrl(url: string, expirationHours: number = 0): Observable<{ short_code: string }> {
        const body: any = { long_url: url };
        if (expirationHours > 0) {
            body.expiration_hours = expirationHours;
        }
        return this.http.post<{ short_code: string }>(`${this.apiUrl}`, body);
    }

    getUserLinks(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`);
    }

    incrementClick(code: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/public/${code}/click`, {});
    }

    deleteLink(urlId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${urlId}`);
    }
}
