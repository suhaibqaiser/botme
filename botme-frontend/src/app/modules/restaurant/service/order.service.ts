import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {AuthenticationService} from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  restaurantId = this.authService.getRestaurantId()
  apiBaseUrl = environment.apiRestaurantUrl;
  orderDetailObj: any = {}

  getOrders(orderStatus: any = ''): Observable<any> {
    const url = `${this.apiBaseUrl}/food/order/search?restaurantId=${this.restaurantId}` + '&orderStatus=' + orderStatus;
    return this.http.get(url);
  }

  getOrderById(orderId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/order/search?restaurantId=${this.restaurantId}&orderLabel=${orderId}`;
    return this.http.get(url);
  }

  getCartById(orderLabel: string = ''): Observable<any> {
    const url = `${this.apiBaseUrl}/food/cart/search?restaurantId=${this.restaurantId}&orderLabel=${orderLabel}`;
    return this.http.get(url);
  }

  getCartByRestaurantId(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/cart/findCartByRestaurantId?restaurantId=${this.restaurantId}`;
    return this.http.get(url);
  }

  setOrderDetailObject(obj: any) {
    this.orderDetailObj = JSON.parse(JSON.stringify(obj))
  }

  getOrderDetailObject() {
    return this.orderDetailObj
  }

  /**
   * update the order status from cart
   */
  updateOrderStatus(orderLabel = '', orderType = '', orderStatus = '') {
    const url = this.apiBaseUrl + "/food/cart/updateOrderStatus?restaurantId=" + this.authService.getRestaurantId() + '&orderLabel=' + orderLabel + '&orderType=' + orderType + '&orderStatus=' + orderStatus
    return this.http.get(url);
  }

  deleteOrderByLabel(order: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/order/deleteByOrderLabel?restaurantId=${this.restaurantId}` + '&orderLabel=' + order.orderLabel;
    return this.http.get(url);
  }

}
