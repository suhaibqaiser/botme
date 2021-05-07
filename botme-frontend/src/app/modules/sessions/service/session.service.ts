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

  getSessionList(): Observable<any> {
    let url = `${this.apiBaseUrl}/session/list`;
    return this.http.get(url);
  }

  getClientDetail(sessionId?: string): Observable<any> {
    var url = `${this.apiBaseUrl}/session/detail`;
    var body = { sessionId: sessionId };
    return this.http.post(url, body);
  }
}
