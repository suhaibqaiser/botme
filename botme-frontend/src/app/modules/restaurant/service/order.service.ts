import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }
  restaurantId = this.authService.getRestaurantId()
  apiBaseUrl = environment.apiRestaurantUrl;

  getOrders(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/order/search?restaurantId=${this.restaurantId}`;
    return this.http.get(url);
  }

  getOrderById(orderId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/order/search?restaurantId=${this.restaurantId}&orderLabel=${orderId}`;
    return this.http.get(url);
  }

  getCartById(orderLabel: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/cart/search?restaurantId=${this.restaurantId}&orderLabel=${orderLabel}`;
    return this.http.get(url);
  }
}
