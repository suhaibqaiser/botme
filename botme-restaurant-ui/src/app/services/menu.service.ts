import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {BotmeClientService} from "./botme-client.service";
import {HelperService} from "./helper.service";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private clientService: BotmeClientService, private http: HttpClient, public _helperService: HelperService) {
  }

  apiBaseUrl = environment.apiRestaurantUrl;

  getProducts(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?restaurantId=` + this._helperService.getRestaurantIdOnAuthBasis();
    return this.http.get(url);
  }

  getCategory(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/category/all?restaurantId=` + this._helperService.getRestaurantIdOnAuthBasis();
    return this.http.get(url);
  }

  getProductById(productId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?productId=${productId}` + '&restaurantId=' + this._helperService.getRestaurantIdOnAuthBasis();
    return this.http.get(url);
  }

  getProductByCategory(productCategory: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?productCategory=${productCategory}` + '&restaurantId=' + this._helperService.getRestaurantIdOnAuthBasis();
    return this.http.get(url);
  }

  getProductsByFiltering(urlString: any) {
    const url = this.apiBaseUrl + "/food/product/search?productCategory=" + urlString.productCategory + '&productName=' + urlString.productName + '&priceMin=' + urlString.priceMin + '&priceMax=' + urlString.priceMax + '&sortByPrice=' + urlString.sortByPrice + '&ratingMin=' + urlString.ratingMin + '&ratingMax=' + urlString.ratingMax + '&restaurantId=' + this._helperService.getRestaurantIdOnAuthBasis()
    return this.http.get(url);
  }

  // Cart Cruds///
  /**
   * Api to add cart against filter customerId & restaurantId & orderLabel
   */
  addToCartApi(cart: any) {
    const url = this.apiBaseUrl + "/food/cart/add?restaurantId=" + this._helperService.getRestaurantIdOnAuthBasis() + '&orderLabel=' + this.clientService.getCookie().orderLabel
    return this.http.post(url, cart);
  }

  /**
   * Api to get cart against filter customerId & reservationLabel & restaurantId
   */
  findAllCartById() {
    // + '&orderType=' + this._helperService.getOrderTypeOnAuthBasis()
    const url = this.apiBaseUrl + "/food/cart/search?restaurantId=" + this._helperService.getRestaurantIdOnAuthBasis() + '&orderLabel=' + this.clientService.getCookie().orderLabel
    return this.http.get(url);
  }

  findOrderByOrderLabel(id: any = '') {
    //+ '&orderType=' + this._helperService.getOrderTypeOnAuthBasis()
    let url = this.apiBaseUrl + "/food/cart/search?restaurantId=" + this._helperService.getRestaurantIdOnAuthBasis() + '&orderLabel=' + id
    return this.http.get(url);
  }

  /**
   * Api to edit cart against filter restaurantId & cartId & orderLabel
   */
  editToCartApi(cart: any) {
    const url = this.apiBaseUrl + "/food/cart/edit?restaurantId=" + this._helperService.getRestaurantIdOnAuthBasis() + "&cartId=" + cart.cart.cartId + '&orderLabel=' + this.clientService.getCookie().orderLabel
    return this.http.post(url, cart);
  }

  /**
   * Api to get cart against filter restaurantId & cartId & orderLabel
   */
  deleteCartById(cartId: any) {
    const url = this.apiBaseUrl + "/food/cart/deleteById?restaurantId=" + this._helperService.getRestaurantIdOnAuthBasis() + "&cartId=" + cartId + '&orderLabel=' + this.clientService.getCookie().orderLabel
    return this.http.get(url);
  }

  /**
   * push notification
   */
  pushNotification(notificationObj: any) {
    const url = this.apiBaseUrl + "/notification/send"
    return this.http.post(url, notificationObj);
  }

  /**
   * Api to get cart against filter restaurantId & cartId & orderLabel
   */
  updateOrderStatus(orderStatus: any = '') {
    const url = this.apiBaseUrl + "/food/cart/updateOrderStatus?restaurantId=" + this._helperService.getRestaurantIdOnAuthBasis() + '&orderLabel=' + this.clientService.getCookie().orderLabel
    return this.http.post(url, {orderType: this.clientService.getCookie().orderType, orderStatus: orderStatus});
  }

}
