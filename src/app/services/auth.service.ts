import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './patients';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('loggedInUserData')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  updateUserObjOnSave(user: any) {
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/patients/authenticate`, {
        email,
        password,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.deleteLS();
          localStorage.setItem('loggedInUserData', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  reglogin(data: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/patients/registerNLogin`, data)
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.deleteLS();
          localStorage.setItem('loggedInUserData', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('loggedInUserData');
    this.currentUserSubject.next(null!);
    return of({ success: false });
  }

  deleteLS() {
    if ('loggedInUserData' in localStorage) {
      localStorage.removeItem('loggedInUserData');
    } else {
      //alert("no");
    }
  }
}
