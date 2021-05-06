import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  apiBaseUrl = environment.apiBaseUrl;
  loginUrl = this.apiBaseUrl + '/auth/login';
  verifyTokenUrl = this.apiBaseUrl + '/auth/verifyToken';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.getToken()
  })

  constructor(private http: HttpClient, private router: Router) {
  }

  userLogin(user: object): Observable<any> {
    let body = user;
    return this.http.post(this.loginUrl, body, {headers: this.headers});
  }

  userLoggedIn(): boolean {
    let token = localStorage.getItem('loginToken')
    if (!token) return false
    if (token === '') return false
    this.http.get(this.verifyTokenUrl, {headers: this.headers}).subscribe(
      res => {
        return true
      },
      error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            console.log(status)
            this.router.navigate(['/login'])
            //this.userLogout()
            return false
          }
        }
        return false
      }
    )
    return true
  }

  userLogout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('loginToken');
  }
}
