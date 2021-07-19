import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) {
  }

  apiBaseUrl = environment.apiRestaurantUrl;

  getAllReservation(): Observable<any> {
    const url = `${this.apiBaseUrl}/reservation/findAll`;
    return this.http.get(url);
  }

  findReservation(reservationId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/reservation/find?reservationId=${reservationId}`;
    return this.http.get(url);
  }
}