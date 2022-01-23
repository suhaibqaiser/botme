import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import {BotmeClientService} from "../../../services/botme-client.service";

@Component({
  selector: 'app-order-section',
  templateUrl: './order-section.component.html',
  styleUrls: ['./order-section.component.scss']
})
export class OrderSectionComponent implements OnInit {

  constructor(public _orderService: OrderService, private _route: Router, private _botMeService: BotmeClientService) {
    this._orderService.selectedOrderButtons[this._botMeService.getCookie()?.orderType] = true
  }


  ngOnInit(): void {
  }

  selectOrderType(type: any) {

   if(Object.keys(this._orderService.selectedOrderButtons).some(k => this._orderService.selectedOrderButtons[k])){

     return
   }

    if (type === 'dine_in') {
      this._orderService.selectedOrderButtons['dine_in'] = true
      this._orderService.selectedOrderButtons['pick_up'] = false
      this._orderService.selectedOrderButtons['delivery'] = false
      this._botMeService.setCookie('orderType','dine_in')
      return this._route.navigate(['reservations'])
    }
    if (type === 'pick_up') {
      this._route.navigate(['online-shop'])
      this._orderService.selectedOrderButtons['dine_in'] = false
      this._orderService.selectedOrderButtons['pick_up'] = true
      this._orderService.selectedOrderButtons['delivery'] = false
      this._botMeService.setCookie('orderType','dine_in')
      return
    }
    if (type === 'delivery') {
      this._orderService.selectedOrderButtons['dine_in'] = false
      this._orderService.selectedOrderButtons['pick_up'] = false
      this._orderService.selectedOrderButtons['delivery'] = true
      this._botMeService.setCookie('orderType','delivery')
      this._route.navigate(['online-shop'])
      return
    }
    return ''
  }
}
