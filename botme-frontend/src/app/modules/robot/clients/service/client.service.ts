import {HttpClient} from '@angular/common/http';
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
  apiRestaurantUrl = environment.apiRestaurantUrl

  getClients(): Observable<any> {
    const url = `${this.apiBaseUrl}/client/list`;
    return this.http.get(url);
  }

  getClientDetail(clientID: string): Observable<any> {
    const url = `${this.apiBaseUrl}/client/detail/?clientID=${clientID}`;
    return this.http.get(url);
  }

  registerClient(client: object): Observable<any> {
    const url = `${this.apiBaseUrl}/client/register`;
    const body = client;
    return this.http.put(url, body);
  }

  updateClient(client: object): Observable<any> {
    const url = `${this.apiBaseUrl}/client/update`;
    const body = client;
    return this.http.post(url, body);
  }

  getActiveRestaurant(){
    const url = `${this.apiRestaurantUrl}/food/restaurant/active-restaurant`;
    return this.http.get(url);
  }
}
