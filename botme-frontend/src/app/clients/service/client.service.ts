import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ea2d3aeaad77865f9769974a920892f5'
  })

  getClients(): Observable<any> {
    var url = 'http://10.0.0.111:3000/client/list';
    return this.http.get(url, { headers: this.headers });
  }

  getClientDetail(clientID?: string): Observable<any> {
    var url = 'http://10.0.0.111:3000/client/detail';
    var body = { clientID: clientID };
    return this.http.post(url, body, { headers: this.headers });
  }
}
