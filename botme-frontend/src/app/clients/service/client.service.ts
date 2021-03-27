import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  apiBaseUrl = environment.apiBaseUrl;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + environment.BearerToken
  })

  getClients(): Observable<any> {
    var url = `${this.apiBaseUrl}/client/list`;
    return this.http.get(url, { headers: this.headers });
  }

  getClientDetail(clientID?: string): Observable<any> {
    var url = `${this.apiBaseUrl}/client/detail`;
    var body = { clientID: clientID };
    return this.http.post(url, body, { headers: this.headers });
  }
}
