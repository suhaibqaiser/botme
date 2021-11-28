import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  apiBaseUrl = environment.apiRestaurantUrl;

  constructor(private http: HttpClient) {
  }

  addReservation(payload: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/reservation/add`;
    return this.http.put(url, {reservation: payload});
  }

  isRequired(value: any) {
    return !(value && value.length)
  }

  isNumberRequired(value: any) {
    return !(value && value > 0)
  }

  isDateRequired(value: any) {
    return !(value)
  }
}
