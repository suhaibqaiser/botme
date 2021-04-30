import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  apiBaseUrl = environment.apiBaseUrl;
  loginUrl = this.apiBaseUrl + '/auth/login';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + environment.BearerToken
  })

  constructor(private http: HttpClient) {
  }

  userLogin(user: object): Observable<any> {
    let body = user;
    return this.http.post(this.loginUrl, body, {headers: this.headers});
  }

  userLoggedIn() {
    return !!localStorage.getItem('loginToken');
  }

  userLogout(): void {
    localStorage.clear();
  }

  validateToken(): boolean {
    if (localStorage.getItem('loginToken') === '') {
    }
    return false
  }
}
