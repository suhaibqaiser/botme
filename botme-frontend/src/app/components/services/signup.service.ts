import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }

  apiBaseUrl = environment.apiBaseUrl;
  apiRestaurantUrl = environment.apiRestaurantUrl;


  addUser(user: object): Observable<any> {
    const url = `${this.apiBaseUrl}/user/add`;
    const body = { user: user };
    return this.http.put(url, body);
}

}
