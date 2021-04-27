import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) {
  }

  apiBaseUrl = environment.apiBaseUrl;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + environment.BearerToken
  });

  getClients(): Observable<any> {
    const url = `${this.apiBaseUrl}/client/list`;
    return this.http.get(url, {headers: this.headers});
  }

  getClientDetail(clientID: string): Observable<any> {
    const url = `${this.apiBaseUrl}/client/detail/?clientID=${clientID}`;
    return this.http.get(url, {headers: this.headers});
  }

  registerClient(client: object): Observable<any> {
    const url = `${this.apiBaseUrl}/client/register`;
    const body = {client};
    return this.http.put(url, body, {headers: this.headers});
  }

  updateClient(client: object): Observable<any> {
    console.log(client);
    const url = `${this.apiBaseUrl}/client/update`;
    const body = client;
    return this.http.post(url, body, {headers: this.headers});
  }
}
