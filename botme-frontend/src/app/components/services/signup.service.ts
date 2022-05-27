import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class SignupService {
 
  constructor(private http: HttpClient) { }
  url=`${environment.apiBaseUrl}/user/add`
  apiBaseUrl = environment.apiBaseUrl;
  apiRestaurantUrl = environment.apiRestaurantUrl;

  

  getAllUser(){  
    return this.http.get(this.url);
}
  saveUserData(data:any) {
    console.log(data);
    return this.http.post(this.url,data)
  }
}
