import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BotmeClientService} from "./botme-client.service";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  apiBaseUrl = environment.apiRestaurantUrl;

  constructor(private clientService: BotmeClientService, private _http: HttpClient) {
  }

  addCustomer(obj: any) {
    const url = this.apiBaseUrl + "/food/customer/add?orderLabel=" + this.clientService.getCookie().orderLabel;
    return this._http.post(url, obj);
  }

  updateCustomer(obj: any) {
    const url = this.apiBaseUrl + "/food/customer/update?customerId=" + obj.customerId;
    return this._http.post(url, obj);
  }

  getCustomer() {
    const url = this.apiBaseUrl + "/food/customer/search?customerId=" + this.clientService.getCookie().customerId;
    return this._http.get(url);
  }
}