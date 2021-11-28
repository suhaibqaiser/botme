import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  productsList = new Subject<any>()
  categoriesList = new Subject<any>()

  constructor(private http: HttpClient) {
    this.categoryApi()
    this.productsApi()
  }

  apiBaseUrl = environment.apiRestaurantUrl;

  getProductList(): Observable<any> {
    return this.productsList
  }

  getCategoryList(): Observable<any> {
    return this.categoriesList
  }

  productsApi() {
    const url = `${this.apiBaseUrl}/food/product/search`;
    this.http.get(url).subscribe((x: any) => {
      this.productsList.next(x.payload);
    })
  }

  categoryApi() {
    const url = `${this.apiBaseUrl}/food/category/all`;
    this.http.get(url).subscribe((x: any) => {
      this.categoriesList.next(x.payload);
    })
  }

  getProductById(productId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?productId=${productId}`;
    return this.http.get(url);
  }

  getProductByCategory(productCategory: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/product/search?productCategory=${productCategory}`;
    return this.http.get(url);
  }

  getProductsByFiltering(urlString: any) {
    const url = this.apiBaseUrl + "/food/product/search?productCategory=" + urlString.productCategory + '&productName=' + urlString.productName + '&priceMin=' + urlString.priceMin + '&priceMax=' + urlString.priceMax + '&sortByPrice=' + urlString.sortByPrice + '&ratingMin=' + urlString.ratingMin + '&ratingMax=' + urlString.ratingMax
    return this.http.get(url);
  }
}
