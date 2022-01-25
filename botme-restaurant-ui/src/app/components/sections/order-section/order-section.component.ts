import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import {BotmeClientService} from "../../../services/botme-client.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-order-section',
  templateUrl: './order-section.component.html',
  styleUrls: ['./order-section.component.scss']
})
export class OrderSectionComponent implements OnInit {

  constructor(public _orderService: OrderService, private _route: Router, public _botMeService: BotmeClientService) {

  }

  orderId = new FormControl('')

  ngOnInit(): void {
    this._orderService.selectedOrderButtons[this._botMeService.getCookie().orderType] = true
  }

  getOrderType(){
    return this._botMeService.getCookie().orderType.replace(/_/g, " ")
  }

  getStatement(){
    return 'Do you have  ' +(['pick_up','delivery'].includes(this._botMeService.getCookie().orderType) ? 'Order' : 'Reservation') + ' Id ?'
  }

  getButtonName(){
    return 'Apply ' +(['pick_up','delivery'].includes(this._botMeService.getCookie().orderType) ? 'Order' : 'Reservation') + ' Id'
  }

  selectOrderType(type: any) {
    if (type === 'dine_in') {
      this._orderService.selectedOrderButtons['dine_in'] = true
      this._orderService.selectedOrderButtons['pick_up'] = false
      this._orderService.selectedOrderButtons['delivery'] = false
      this._botMeService.setCookie('orderType','dine_in')
    }
    if (type === 'pick_up') {
      this._orderService.selectedOrderButtons['dine_in'] = false
      this._orderService.selectedOrderButtons['pick_up'] = true
      this._orderService.selectedOrderButtons['delivery'] = false
      this._botMeService.setCookie('orderType','pick_up')
    }
    if (type === 'delivery') {
      this._orderService.selectedOrderButtons['dine_in'] = false
      this._orderService.selectedOrderButtons['pick_up'] = false
      this._orderService.selectedOrderButtons['delivery'] = true
      this._botMeService.setCookie('orderType','delivery')
    }
    return ''
  }
}
