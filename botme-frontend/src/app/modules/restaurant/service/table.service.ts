import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TableService {

    constructor(private http: HttpClient) {
    }

    apiBaseUrl = environment.apiRestaurantUrl;

    getAllTables(): Observable<any> {
        const url = `${this.apiBaseUrl}/food/tables`;
        return this.http.get(url);
    }

    addTable(table: any): Observable<any> {
        const url = `${this.apiBaseUrl}/food/tables/add`;
        const body = { table: table }
        return this.http.put(url, body);
    }

    updateTable(tableObject: any): Observable<any> {
        const url = `${this.apiBaseUrl}/food/tables/update`;
        const body = { table: tableObject }
        return this.http.post(url, body);
    }

    getTableById(tableId: string): Observable<any>{
        const url = `${this.apiBaseUrl}/food/tables/search?tableId=${tableId}`;
        return this.http.get(url);
    }
}