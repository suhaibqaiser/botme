import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {
    }

    apiBaseUrl = environment.apiBaseUrl;
    apiRestaurantUrl = environment.apiRestaurantUrl;


    getUsers(): Observable<any> {
        const url = `${this.apiBaseUrl}/user/list`;
        return this.http.get(url);
    }

    getUserDetails(userId: string): Observable<any> {
        const url = `${this.apiBaseUrl}/user/byid?userId=${userId}`;
        return this.http.get(url);
    }

    addUser(user: object): Observable<any> {
        const url = `${this.apiBaseUrl}/user/add`;
        const body = { user: user };
        return this.http.put(url, body);
    }

    updateUser(user: object): Observable<any> {
        const url = `${this.apiBaseUrl}/user/update`;
        const body = { user: user };
        return this.http.post(url, body);
    }

    getRestaurants(): Observable<any> {
        const url = `${this.apiRestaurantUrl}/food/restaurant`;
        return this.http.get(url);
    }
}
