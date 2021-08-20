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
    const url = `${this.apiBaseUrl}/dictionary/product/search`;
    return this.http.get(url);
  }

  getProductsByCategory(category: string): Observable<any> {
    const url = `${this.apiBaseUrl}/dictionary/product/search?productCategory=${category}`;
    return this.http.get(url);
  }

  getProductsByType(type: string): Observable<any> {
    const url = `${this.apiBaseUrl}/dictionary/product/search?productType=${type}`;
    return this.http.get(url);
  }

  getProductById(productId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/dictionary/product/search?productId=${productId}`;
    return this.http.get(url);
  }

  updateProduct(product: any): Observable<any> {
    const url = `${this.apiBaseUrl}/dictionary/product/update`;
    const body = { product: product };
    return this.http.post(url, body);
  }

  addProduct(product: any): Observable<any> {
    const url = `${this.apiBaseUrl}/dictionary/product/add`;
    const body = product;
    return this.http.put(url, body);
  }
}
