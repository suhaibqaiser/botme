import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {
  }

  apiBaseUrl = environment.apiRestaurantUrl;

  getCustomers(): Observable<any> {
    const url = `${this.apiBaseUrl}/customer/`;
    return this.http.get(url);
  }

  getCustomerDetail(customerId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/customer/search/?customerId=${customerId}`;
    return this.http.get(url);
  }

  getCustomerByName(name: string): Observable<any> {
    const url = `${this.apiBaseUrl}/customer/search/?name=${name}`;
    return this.http.get(url);
  }

  registerCustomer(customer: object): Observable<any> {
    const url = `${this.apiBaseUrl}/customer/add`;
    const body = { customer: customer };
    return this.http.put(url, body);
  }

  updateCustomer(customer: object): Observable<any> {

    const url = `${this.apiBaseUrl}/customer/update`;
    const body = { customer: customer };
    return this.http.post(url, body);
  }
}
