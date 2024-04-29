import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  apiBaseURL = 'https://localhost:7115/api/Users';
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiBaseURL);
  }
}
