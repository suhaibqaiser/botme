import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  apiBaseUrl = environment.apiRestaurantUrl;
  constructor(private http: HttpClient) {}

  getAreas(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/restaurant/getAreaList`;
    return this.http.get(url);
  }
}
