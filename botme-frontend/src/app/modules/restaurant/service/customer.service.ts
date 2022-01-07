import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }
  restaurantId = this.authService.getRestaurantId()

  apiBaseUrl = environment.apiRestaurantUrl;

  getCustomers(): Observable<any> {
    const url = `${this.apiBaseUrl}/food/customer?restaurantId=${this.restaurantId}`;
    return this.http.get(url);
  }

  getCustomerDetail(customerId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/customer/search?restaurantId=${this.restaurantId}&customerId=${customerId}`;
    return this.http.get(url);
  }

  getCustomerByName(name: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/customer/search?restaurantId=${this.restaurantId}&name=${name}`;
    return this.http.get(url);
  }

  registerCustomer(customer: object): Observable<any> {
    const url = `${this.apiBaseUrl}/food/customer/add`;
    const body = { customer: customer, restaurantId: this.restaurantId };
    return this.http.put(url, body);
  }

  updateCustomer(customer: object): Observable<any> {
    const url = `${this.apiBaseUrl}/food/customer/update`;
    const body = { customer: customer, restaurantId: this.restaurantId };
    return this.http.post(url, body);
  }

  getAddressesByCustomer(customerId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/food/address/search?restaurantId=${this.restaurantId}&customerId=${customerId}`;
    return this.http.get(url);
  }
}
