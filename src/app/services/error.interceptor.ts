import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          location.reload();
        }
        if (err instanceof HttpErrorResponse) {
          if (err.status === 0) {
            return throwError(
              () =>
                new Error(
                  'We are experiencing technical difficulties ...Please try again later'
                )
            );
          }
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
