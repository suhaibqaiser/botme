import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    constructor(private http: HttpClient) {
    }

    apiBaseUrl = environment.apiRestaurantUrl;

    getProducts(): Observable<any> {
        const url = `${this.apiBaseUrl}/food/product/search`;
        return this.http.get(url);
    }

    getCategory(): Observable<any> {
        const url = `${this.apiBaseUrl}/food/category/all`;
        return this.http.get(url);
    }

  getProductById(productId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?productId=${productId}`;
    return this.http.get(url);
  }
}
