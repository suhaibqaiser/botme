import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";

@Component({
  selector: 'app-checkout-section',
  templateUrl: './checkout-section.component.html',
  styleUrls: ['./checkout-section.component.scss']
})
export class CheckoutSectionComponent implements OnInit {

  constructor(public _cartService: CartService) {
  }

  ngOnInit(): void {
  }
}
