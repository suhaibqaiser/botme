import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BotmeClientService} from "./botme-client.service";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  apiBaseUrl = environment.apiRestaurantUrl;
  botMeClientBaseURL = environment.botMeClientAPI;
  constructor(private clientService: BotmeClientService, private _http: HttpClient) {
  }

  addCustomer(obj: any) {
    const url = this.apiBaseUrl + "/food/customer/add?orderLabel=" + this.clientService.getCookie().orderLabel +"&clientID=" + this.clientService.getCookie().clientID;
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

  sendEmail(body:any) {
    const url = `${this.botMeClientBaseURL}/email/sendEmail?emailSendingTypes=place_order`;
    return this._http.post(url,body);
  }
}
