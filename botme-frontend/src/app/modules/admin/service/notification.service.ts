import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {AuthenticationService} from 'src/app/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private http: HttpClient , private authService:AuthenticationService) {

    }
    restaurantId = this.authService.getRestaurantId()
    apiBaseUrl = environment.apiRestaurantUrl;

    testNotification(){
        const url = `${this.apiBaseUrl}/notification/test?restaurantId=${this.restaurantId}`;
        const body = {};
        return this.http.post(url, body);
    }
    SetSummaryTime(){
        const url = `${this.apiBaseUrl}/notification/time?restaurantId=${this.restaurantId}`;
        const body = {};
        return this.http.post(url, body);
    }
}