import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class TableService {

    constructor(private http: HttpClient, private authService: AuthenticationService) {
    }
    restaurantId = this.authService.getRestaurantId()

    apiBaseUrl = environment.apiRestaurantUrl;

    getAllTables(): Observable<any> {
        const url = `${this.apiBaseUrl}/food/tables?restaurantId=${this.restaurantId}`;
        return this.http.get(url);
    }

    addTable(table: any): Observable<any> {
        const url = `${this.apiBaseUrl}/food/tables/add`;
        const body = { table: table, restaurantId: this.restaurantId }
        return this.http.put(url, body);
    }

    updateTable(table: any): Observable<any> {
        const url = `${this.apiBaseUrl}/food/tables/update`;
        const body = { table: table, restaurantId: this.restaurantId }
        return this.http.post(url, body);
    }

    getTableById(tableId: string): Observable<any> {
        const url = `${this.apiBaseUrl}/food/tables/search?restaurantId=${this.restaurantId}&tableId=${tableId}`;
        return this.http.get(url);
    }
}