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
   * Api to add cart against filter customerId & restaurantId & orderId
   */
  addToCartApi(cart: any) {

    let obj = {
      restaurantId:this.clientService.getCookie().restaurantId ? this.clientService.getCookie().restaurantId : '',
      customerId:this.clientService.getCookie().clientID ? this.clientService.getCookie().clientID : '',
      orderId:this.clientService.getCookie().orderId ? this.clientService.getCookie().orderId : '',
    }

    const url = this.apiBaseUrl + "/food/cart/add?restaurantId=" + obj.restaurantId  + '&customerId=' + obj.customerId + '&orderId=' + obj.orderId
    return this.http.post(url, cart);
  }

  /**
   * Api to get cart against filter customerId & reservationId & restaurantId
   */
  findAllCartById() {

    let obj = {
      restaurantId:this.clientService.getCookie().restaurantId ? this.clientService.getCookie().restaurantId : '',
      customerId:this.clientService.getCookie().clientID ? this.clientService.getCookie().clientID : ''
    }

    const url = this.apiBaseUrl + "/food/cart/search?restaurantId=" + obj.restaurantId + '&customerId=' + obj.customerId
    return this.http.get(url);
  }

  /**
   * Api to edit cart against filter restaurantId & cartId & orderId
   */
  editToCartApi(cart: any) {

    let obj = {
      restaurantId:this.clientService.getCookie().restaurantId ? this.clientService.getCookie().restaurantId : '',
      orderId:this.clientService.getCookie().orderId ? this.clientService.getCookie().orderId : '',
    }

    const url = this.apiBaseUrl + "/food/cart/edit?restaurantId=" + obj.restaurantId + "&cartId=" + cart.cart.cartId + '&orderId=' + obj.orderId
    return this.http.post(url, cart);
  }

  /**
   * Api to get cart against filter restaurantId & cartId & orderId
   */
  deleteCartById(cartId: any) {

    let obj = {
      restaurantId:this.clientService.getCookie().restaurantId ? this.clientService.getCookie().restaurantId : '',
      orderId:this.clientService.getCookie().orderId ? this.clientService.getCookie().orderId : '',
    }

    const url = this.apiBaseUrl + "/food/cart/deleteById?restaurantId=" + obj.restaurantId + "&cartId=" + cartId + '&orderId=' + obj.orderId
    return this.http.get(url);
  }
}
