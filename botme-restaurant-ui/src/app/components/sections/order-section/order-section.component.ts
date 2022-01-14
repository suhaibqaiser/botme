import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-order-section',
  templateUrl: './order-section.component.html',
  styleUrls: ['./order-section.component.scss']
})
export class OrderSectionComponent implements OnInit {

  constructor(private _route: Router) {
  }

  selectedOrder = {
    'dine-in': false,
    'pick-in': false,
    'delivery': false
  }


  ngOnInit(): void {
  }

  selectOrderType(type: any) {
    if (type === 'dine-in') {

      return this._route.navigate(['reservations'])
    }
    if (type === 'pick-in') return this._route.navigate(['online-shop'])
    if (type === 'delivery') return this._route.navigate(['online-shop'])
    return ''
  }
}
