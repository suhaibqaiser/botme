import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class RestaurantService {

    constructor(private http: HttpClient) {
    }

    apiBaseUrl = environment.apiRestaurantUrl;


    getRestaurants(): Observable<any> {
        const url = `${this.apiBaseUrl}/food/restaurant`;
        return this.http.get(url);
    }

}
