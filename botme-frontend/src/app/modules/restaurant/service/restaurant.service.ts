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

    getRestaurantById(id: string): Observable<any> {
        const url = `${this.apiBaseUrl}/food/restaurant/getbyid?restaurantId=${id}`;
        return this.http.get(url);
    }

    addRestaurant(restaurant: any): Observable<any> {
        const url = `${this.apiBaseUrl}/food/restaurant/add`;
        let body = { restaurant: restaurant };
        return this.http.put(url, body);
    }

    updateRestaurant(restaurant: any): Observable<any> {
        const url = `${this.apiBaseUrl}/food/restaurant/update`;
        let body = { restaurant: restaurant };
        return this.http.post(url, body);
    }
}