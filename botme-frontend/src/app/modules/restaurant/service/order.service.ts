import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {
  }

  apiBaseUrl = environment.apiRestaurantUrl;

  getOrders(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/order/search`;
    return this.http.get(url);
  }

  getOrderById(orderId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/order/search?orderId=${orderId}`;
    return this.http.get(url);
  }

  getCartById(cartId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/cart/search?orderId=${cartId}`;
    return this.http.get(url);
  }
}
