import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }
  restaurantId = this.authService.getRestaurantId()
  apiBaseUrl = environment.apiRestaurantUrl;

  getAllReservation(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/reservation/findAll?restaurantId=${this.restaurantId}`;
    return this.http.get(url);
  }

  findReservation(reservationId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/reservation/find?restaurantId=${this.restaurantId}&reservationId=${reservationId}`;
    return this.http.get(url);
  }

  editReservation(reservation: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/reservation/edit`;
    let body = { reservation: reservation, restaurantId: this.restaurantId }
    return this.http.post(url, body);
  }

  addReservation(reservation: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/reservation/add`;
    let body = { reservation: reservation, restaurantId: this.restaurantId }
    return this.http.put(url, body);
  }
}
