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
   * Api to add cart against restaurantId and cartId
   */
  addToCartApi(cart: any) {
    const url = this.apiBaseUrl + "/food/cart/add"
    return this.http.put(url, cart);
  }
  /**
   * Api to get cart against restaurantId and cartId
   */
  findCartById() {
    const url = this.apiBaseUrl + "/food/cart/findCartById?restaurantId=" + this.clientService.getCookie().restaurantId + '&cartId=' + this.clientService.getCookie().cartId + '&customerId=' + this.clientService.getCookie().clientID
    return this.http.get(url);
  }
}
