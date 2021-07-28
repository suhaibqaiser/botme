import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  apiBaseUrl = environment.apiRestaurantUrl;

  getProducts(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search`;
    return this.http.get(url);
  }

  getProductsByCategory(category: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?category=${category}`;
    return this.http.get(url);
  }

  getProductById(productId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?productId=${productId}`;
    return this.http.get(url);
  }

  updateProduct(product: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/update`;
    const body = { product: product };
    return this.http.post(url, body);
  }

  addProduct(product: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/add`;
    const body = [product];
    return this.http.put(url, body);
  }
}
