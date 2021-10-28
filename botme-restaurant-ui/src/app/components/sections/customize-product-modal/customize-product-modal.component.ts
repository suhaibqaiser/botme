import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-customize-product-modal',
  templateUrl: './customize-product-modal.component.html',
  styleUrls: ['./customize-product-modal.component.scss']
})
export class CustomizeProductModalComponent implements OnInit {

  constructor(public cartService: CartService, public _socketService: SocketService) {
  }

  ngOnInit(): void {
  }

  addToCart() {
    this._socketService.speachInput.reset()
    this._socketService.getCurrentContext()
    this.cartService.addToCart(this.cartService.singleCustomProductObj);
    document.getElementById("entityId-order-online")?.click()
  }

  editToCart() {
    this._socketService.speachInput.reset()
    this._socketService.getCurrentContext()
    this.cartService.addToCart(this.cartService.singleCustomProductObj, true);
    document.getElementById("entityId-order-online")?.click()
    document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:block')
  }

  cancelModal() {
    this._socketService.speachInput.reset()
    this._socketService.getCurrentContext()
  }
}
