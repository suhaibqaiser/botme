import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  apiBaseUrl = environment.apiRestaurantUrl;

  getCategories(): Observable<any> {
    const url = `${this.apiBaseUrl}/category/all`;
    return this.http.get(url);
  }

  addCategory(category: object): Observable<any> {
    const url = `${this.apiBaseUrl}/category/add`;
    const body = { category: category };
    return this.http.put(url, body);
  }

  editCategory(category: object): Observable<any> {
    const url = `${this.apiBaseUrl}/category/edit`;
    const body = { category: category };
    return this.http.post(url, body);
  }

  removeCategory(categoryId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/category/remove?categoryId=${categoryId}`;
    return this.http.delete(url);
  }

}
