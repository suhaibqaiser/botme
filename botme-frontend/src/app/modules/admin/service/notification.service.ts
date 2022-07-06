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

    // getOrders(): Observable<any> {
    //     const url = `${this.apiBaseUrl}/food/order/search?restaurantId=${this.restaurantId}`;
    //     return this.http.get(url);
    // }
    testNotification(){
        const url = `${this.apiBaseUrl}/notification/test`;
        const body = {};
        return this.http.post(url, body);
    }
    SetSummaryTime(){
        const url = `${this.apiBaseUrl}/notification/time`;
        const body = {};
        return this.http.post(url, body);
    }
    // Notification(size:any=''){
    //   if (Notification.permission === 'granted'){
    //      const notification = new Notification("Order Summary",{
    //      body: size + " order placed in 30 second" 
    //       });
    //   }else if (Notification.permission !== 'denied'){
    //     Notification.requestPermission().then(permission =>{
    //         const notification = new Notification("Order Summary",{
    //         body: size + " order placed in 30 second"
    //         });
    //     }
    //   }
    // }
}