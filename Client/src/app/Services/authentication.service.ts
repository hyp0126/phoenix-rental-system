import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { UserInfo } from '../Models/userDetailsDTO';
import { UserToken } from 'src/app/Models/userToken';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserToken>;
  //public currentUserInfo: Observable<UserDetailsDTO>;
  public currentUser: Observable<UserToken>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserToken>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserToken {
    return this.currentUserSubject.value;
  }

  createUser(val: UserInfo) {
    //return this.http.post(environment.apiUrl+'/Authentication/CreateUser',val)
    return this.http.post<UserToken>(`${environment.apiUrl}/Authentication/CreateUser`, val).pipe(
      map((user: UserToken) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        const test = user.userId;
        localStorage.setItem('currentUser', JSON.stringify(user));
        //localStorage.setItem('userId', JSON.stringify(val.Email));
        localStorage.setItem('jwt', user.token.replace(/['"]+/g, ''));
        localStorage.setItem('userId', JSON.stringify(test));
        this.currentUserSubject.next(user);
        return user;
      })
    );
    // localStorage.setItem("jwt", token);
    // localStorage.setItem("userId", val.Email);
  }

  login(Email: string, Password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/Authentication/Login`, { Email, Password })
      .pipe(
        map((user: UserToken) => {
          const userId = user.userId;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          //localStorage.setItem('userId', JSON.stringify(Email));
          localStorage.setItem('jwt', user.token.replace(/['"]+/g, ''));
          localStorage.setItem('userId', JSON.stringify(userId));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  changePassword(val: UserInfo) {
    return this.http.post<any>(`${environment.apiUrl}/Authentication/ChangePassword`, val).pipe(
      map((user) => {
        this.currentUserSubject.next(user);
        return user;
      })
    );
    // localStorage.setItem("jwt", token);
    // localStorage.setItem("userId", val.Email);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
