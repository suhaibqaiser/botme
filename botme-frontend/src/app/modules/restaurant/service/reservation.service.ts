import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) {
  }

  apiBaseUrl = environment.apiRestaurantUrl;

  getAllReservation(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/reservation/findAll`;
    return this.http.get(url);
  }

  findReservation(reservationId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/reservation/find?reservationId=${reservationId}`;
    return this.http.get(url);
  }

  editReservation(reservation: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/reservation/edit`;
    let body = { reservation: reservation }
    return this.http.post(url, body);
  }

  addReservation(reservation: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/reservation/add`;
    let body = { reservation: reservation }
    return this.http.post(url, body);
  }
}
