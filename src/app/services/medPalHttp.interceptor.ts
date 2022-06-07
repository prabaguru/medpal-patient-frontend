import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';

@Injectable()
export class MedPalHttpInterceptor implements HttpInterceptor {
  userInfo: any;

  constructor(public router: Router, private commonService: CommonService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let currentUser = this.commonService.currentUserData
      ? this.commonService.currentUserData
      : '';
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
    }

    return next.handle(request);
  }
  // intercept(
  //   request: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   // Get the Authentication token
  //   const token = this.commonService.currentUserData
  //     ? this.commonService.currentUserData.token
  //     : '';
  //   const baseUrl = environment.apiUrl;
  //   // adding headers
  //   (request.headers as any).headers
  //     .set('X-Content-Type-Options', 'nosniff')
  //     .set('Set-Cookie', 'SameSite=Lax');
  //   if (token) {
  //     (request.headers as any).headers.set(`Bearer ${token}`);
  //   } else {
  //     //only for testing purpose
  //     (request.headers as any).headers.set('Access-Control-Allow-Origin', '*');
  //   }
  //   return next.handle(request).pipe(
  //     map((event: HttpEvent<any>) => {
  //       return event;
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       // based on error message for token expired/wrong token, we will change this condition
  //       if (
  //         error.message === 'X-AUTH-TOKEN is not found in request header' ||
  //         error.message ===
  //           'Invalid Auth Token. No User is registered with this token'
  //       ) {
  //         this.router.navigate(['/medpal']);
  //       }
  //       this.commonService.showNotification(error.message, 8000);
  //       return throwError(error);
  //     }),
  //     map((err: any) => {
  //       return err;
  //     })
  //   );
  // }
}
