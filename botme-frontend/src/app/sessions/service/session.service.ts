import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }

  apiBaseUrl = environment.apiBaseUrl;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + environment.BearerToken
  })

  getSessionList(): Observable<any> {
    let url = `${this.apiBaseUrl}/session/list`;
    return this.http.get(url, { headers: this.headers });
  }

  getClientDetail(sessionId?: string): Observable<any> {
    var url = `${this.apiBaseUrl}/session/detail`;
    var body = { sessionId: sessionId };
    return this.http.post(url, body, { headers: this.headers });
  }
}
