import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  
  constructor(private http: HttpClient) { }

  apiBaseUrl = environment.apiBaseUrl;
  apiRestaurantUrl = environment.apiRestaurantUrl;
  

  getAllUser(user: object): Observable<any> {
    const url = `${this.apiBaseUrl}/user/add`;
    const body = { user: user };
    return this.http.put(url, body);
}
  saveUserData(data: any){
    console.log(data);
    return this.http.post( this.apiBaseUrl, data)
  }
}
