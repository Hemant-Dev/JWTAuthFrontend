import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient, private router: Router) {}

  baseURL: string = 'https://localhost:7115/api/Users';

  signUp(userObj: any) {
    return this._http.post(this.baseURL + `/register`, userObj);
  }
  login(loginObj: any) {
    return this._http.post(this.baseURL + `/authenticate`, loginObj);
  }
  signout() {
    localStorage.clear();
    this;
    this.router.navigate(['login']);
  }
  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  isLoggedIn(): boolean {
    return !localStorage.getItem('token');
  }
}
