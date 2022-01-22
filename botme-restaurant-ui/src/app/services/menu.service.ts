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
   * Api to add cart against restaurantId and cartID
   */
  addToCartApi(cart: any) {
    const url = this.apiBaseUrl + "/food/cart/add"
    return this.http.put(url, cart);
  }

  /**
   * Api to get cart against restaurantId and cartID
   */
  findAllCartById() {
    const url = this.apiBaseUrl + "/food/cart/search?restaurantId=" + this.clientService.getCookie().restaurantId + '&cartLabel=' + this.clientService.getCookie().cartLabel + '&customerId=' + this.clientService.getCookie().clientID
    return this.http.get(url);
  }

  /**
   * Api to edit cart against restaurantId and cartID
   */
  editToCartApi(cart: any) {
    const url = this.apiBaseUrl + "/food/cart/edit?restaurantId=" + this.clientService.getCookie().restaurantId  + "&cartLabel=" + cart.cart.cartLabel
    return this.http.post(url, cart);
  }

  /**
   * Api to get cart against restaurantId and cartID
   */
  deleteCartById(cartLabel: any) {
    const url = this.apiBaseUrl + "/food/cart/deleteById?restaurantId=" + this.clientService.getCookie().restaurantId + "&cartLabel=" + cartLabel
    return this.http.get(url);
  }
}
