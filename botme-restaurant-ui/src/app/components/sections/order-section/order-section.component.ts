import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {OrderService} from "../../../services/order.service";

@Component({
  selector: 'app-order-section',
  templateUrl: './order-section.component.html',
  styleUrls: ['./order-section.component.scss']
})
export class OrderSectionComponent implements OnInit {

  constructor(public _orderService: OrderService, private _route: Router) {
  }


  ngOnInit(): void {
  }

  selectOrderType(type: any) {
    if (type === 'dine_in') {
      this._orderService.selectedOrderButtons['dine_in'] = true
      return this._route.navigate(['reservations'])
    }
    if (type === 'pick_up') return this._route.navigate(['online-shop'])
    if (type === 'delivery') return this._route.navigate(['online-shop'])
    return ''
  }
}
