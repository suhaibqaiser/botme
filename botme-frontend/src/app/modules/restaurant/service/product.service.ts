import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }
  restaurantId = this.authService.getRestaurantId()
  apiBaseUrl = environment.apiRestaurantUrl;

  getProducts(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?restaurantId=${this.restaurantId}`;
    return this.http.get(url);
  }

  getDictionaryProducts(name: string): Observable<any> {
    const url = `${this.apiBaseUrl}/dictionary/product/search?restaurantId=${this.restaurantId}&searchText=${name}`;
    return this.http.get(url);
  }

  getProductsByCategory(category: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?restaurantId=${this.restaurantId}&productCategory=${category}`;
    return this.http.get(url);
  }

  getProductsByType(type: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?restaurantId=${this.restaurantId}&productType=${type}`;
    return this.http.get(url);
  }

  getProductById(productId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?restaurantId=${this.restaurantId}&productId=${productId}`;
    return this.http.get(url);
  }

  updateProduct(product: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/update`;
    const body = { product: product, restaurantId: this.restaurantId };
    return this.http.post(url, body);
  }

  addProduct(product: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/add`;
    const body = { product: product, restaurantId: this.restaurantId };
    return this.http.put(url, body);
  }
}
