import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { TokenApi } from '../Models/token-api';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private toast: NgToastService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();

    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` },
      });
    }
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            return this.handleUnAuthorizedError(request, next);
          }
        }
        // console.log(err);
        return throwError(() => new Error(err.error.message));
      })
    );
  }
  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    // debugger;
    const accessToken = this.auth.getToken();
    const refreshToken = this.auth.getRefreshToken();
    let tokenApi = new TokenApi();
    if (accessToken !== null) {
      tokenApi.accessToken = accessToken;
    }
    if (refreshToken !== null) {
      tokenApi.refreshToken = refreshToken;
    }
    // tokenApi.accessToken ? null : accessToken;
    // tokenApi.refreshToken ? null : refreshToken;
    return this.auth.renewToken(tokenApi).pipe(
      switchMap((data: TokenApi) => {
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.accessToken);
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${data.accessToken}` },
        });
        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          this.toast.warning({
            detail: 'Warning',
            summary: 'Token has expired, Please Login again',
          });
          this.router.navigate(['login']);
        });
      })
    );
  }
}
