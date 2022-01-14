import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }
  restaurantId = this.authService.getRestaurantId()
  apiBaseUrl = environment.apiRestaurantUrl;

  getCategories(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/category/all?restaurantId=${this.restaurantId}`;
    return this.http.get(url);
  }

  addCategory(category: object): Observable<any> {
    const url = `${this.apiBaseUrl}/food/category/add`;
    const body = { category: category, restaurantId: this.restaurantId };
    return this.http.put(url, body);
  }

  editCategory(category: object): Observable<any> {
    const url = `${this.apiBaseUrl}/food/category/edit`;
    const body = { category: category, restaurantId: this.restaurantId };
    return this.http.post(url, body);
  }

  removeCategory(categoryId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/category/remove?categoryId=${categoryId}`;
    return this.http.delete(url);
  }

}
