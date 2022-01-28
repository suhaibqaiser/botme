import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {BotmeClientService} from "./botme-client.service";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private clientService: BotmeClientService, private http: HttpClient) {
  }

  apiBaseUrl = environment.apiRestaurantUrl;

  getProducts(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?restaurantId=` + this.clientService.getCookie().restaurantId;
    return this.http.get(url);
  }

  getCategory(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/category/all?restaurantId=` + this.clientService.getCookie().restaurantId;
    return this.http.get(url);
  }

  getProductById(productId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?productId=${productId}` + '&restaurantId=' + this.clientService.getCookie().restaurantId;
    return this.http.get(url);
  }

  getProductByCategory(productCategory: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?productCategory=${productCategory}` + '&restaurantId=' + this.clientService.getCookie().restaurantId;
    return this.http.get(url);
  }

  getProductsByFiltering(urlString: any) {
    const url = this.apiBaseUrl + "/food/product/search?productCategory=" + urlString.productCategory + '&productName=' + urlString.productName + '&priceMin=' + urlString.priceMin + '&priceMax=' + urlString.priceMax + '&sortByPrice=' + urlString.sortByPrice + '&ratingMin=' + urlString.ratingMin + '&ratingMax=' + urlString.ratingMax + '&restaurantId=' + this.clientService.getCookie().restaurantId
    return this.http.get(url);
  }

  // Cart Cruds///
  /**
   * Api to add cart against filter customerId & restaurantId & orderLabel
   */
  addToCartApi(cart: any) {

    let obj = {
      restaurantId: this.clientService.getCookie().restaurantId ? this.clientService.getCookie().restaurantId : '',
      orderLabel: this.clientService.getCookie().orderLabel ? this.clientService.getCookie().orderLabel : '',
    }

    const url = this.apiBaseUrl + "/food/cart/add?restaurantId=" + obj.restaurantId + '&orderLabel=' + obj.orderLabel
    return this.http.post(url, cart);
  }

  /**
   * Api to get cart against filter customerId & reservationLabel & restaurantId
   */
  findAllCartById() {
    let obj = {
      restaurantId: this.clientService.getCookie().restaurantId ? this.clientService.getCookie().restaurantId : '',
      orderLabel: this.clientService.getCookie().orderLabel ? this.clientService.getCookie().orderLabel : '',
      orderType: this.clientService.getCookie().orderType ? this.clientService.getCookie().orderType : '',
    }
    const url = this.apiBaseUrl + "/food/cart/search?restaurantId=" + obj.restaurantId + '&orderLabel=' + obj.orderLabel + '&orderType=' + obj.orderType
    return this.http.get(url);
  }

  findOrderByOrderLabel(id: any = '', orderType: any = '') {
    let url = ''
    let obj: any = {}
    if (orderType === 'dine_in') {
      obj = {
        restaurantId: this.clientService.getCookie().restaurantId ? this.clientService.getCookie().restaurantId : ''
      }
      url = this.apiBaseUrl + "/food/cart/search?restaurantId=" + obj.restaurantId + '&reservationLabel=' + id
      return this.http.get(url);
    }

    obj = {
      restaurantId: this.clientService.getCookie().restaurantId ? this.clientService.getCookie().restaurantId : '',
      orderType: this.clientService.getCookie().orderType ? this.clientService.getCookie().orderType : '',
    }
    url = this.apiBaseUrl + "/food/cart/search?restaurantId=" + obj.restaurantId + '&orderLabel=' + id + '&orderType=' + obj.orderType
    return this.http.get(url);
  }

  /**
   * Api to edit cart against filter restaurantId & cartId & orderLabel
   */
  editToCartApi(cart: any) {

    let obj = {
      restaurantId: this.clientService.getCookie().restaurantId ? this.clientService.getCookie().restaurantId : '',
      orderLabel: this.clientService.getCookie().orderLabel ? this.clientService.getCookie().orderLabel : '',
    }

    const url = this.apiBaseUrl + "/food/cart/edit?restaurantId=" + obj.restaurantId + "&cartId=" + cart.cart.cartId + '&orderLabel=' + obj.orderLabel
    return this.http.post(url, cart);
  }

  /**
   * Api to get cart against filter restaurantId & cartId & orderLabel
   */
  deleteCartById(cartId: any) {

    let obj = {
      restaurantId: this.clientService.getCookie().restaurantId ? this.clientService.getCookie().restaurantId : '',
      orderLabel: this.clientService.getCookie().orderLabel ? this.clientService.getCookie().orderLabel : '',
    }

    const url = this.apiBaseUrl + "/food/cart/deleteById?restaurantId=" + obj.restaurantId + "&cartId=" + cartId + '&orderLabel=' + obj.orderLabel
    return this.http.get(url);
  }

  /**
   * update the order status from cart
   */
  updateOrderStatus() {
    const obj = {
      restaurantId: this.clientService.getCookie().restaurantId ? this.clientService.getCookie().restaurantId : '',
      orderLabel: this.clientService.getCookie().orderLabel ? this.clientService.getCookie().orderLabel : '',
      orderType: this.clientService.getCookie().orderType ? this.clientService.getCookie().orderType : '',
    }
    const url = this.apiBaseUrl + "/food/cart/updateOrderStatus?restaurantId=" + obj.restaurantId + '&orderLabel=' + obj.orderLabel + '&orderType=' + obj.orderType
    return this.http.get(url);
  }
}
