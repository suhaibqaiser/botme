import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  apiBaseUrl = environment.apiRestaurantUrl;
  constructor(private http: HttpClient) {
  }

  getAllMenu(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/menus`;
    return this.http.get(url);
  }

  addMenu(table: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/menus/add`;
    const body = { table: table }
    return this.http.put(url, body);
  }

  updateMenu(tableObject: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/menus/update`;
    const body = { table: tableObject }
    return this.http.post(url, body);
  }

  getMenuById(menuId: string): Observable<any>{
    const url = `${this.apiBaseUrl}/food/menus/search?menuId=${menuId}`;
    return this.http.get(url);
  }
}
