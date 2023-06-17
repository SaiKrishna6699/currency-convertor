import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl = 'https://api.apilayer.com/fixer/';
  private apiKey = 'MiipP5PbZh70DkUd3rZxBY62KcLFXJHm';

  constructor(private http: HttpClient) { }

  getSymbols(): Observable<any> {
    const headers = new HttpHeaders().append('apikey', this.apiKey);
    return this.http.get<any>(this.apiUrl+"symbols", { headers });
  }

  convertCurrency(to: string, from: string, amount: number): Observable<any> {
    const headers = new HttpHeaders().append('apikey', this.apiKey);
    const url = `${this.apiUrl}convert?to=${to}&from=${from}&amount=${amount}`;
    return this.http.get<any>(url, { headers });
  }
}