import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {SocketService} from "../../../services/socket.service";
import {HelperService} from "../../../services/helper.service";
import {ContextService} from "../../../services/context.service";

@Component({
  selector: 'app-customize-product-modal',
  templateUrl: './customize-product-modal.component.html',
  styleUrls: ['./customize-product-modal.component.scss']
})
export class CustomizeProductModalComponent implements OnInit {

  constructor(private _contextService: ContextService, public _helperService: HelperService, public cartService: CartService, public _socketService: SocketService) {
  }

  ngOnInit(): void {
  }

  addToCart() {
    this._contextService.getCurrentContext()
    this.cartService.addToCart(this.cartService.singleCustomProductObj, 'add_local_list');
  }

  editToCart() {
    this._contextService.getCurrentContext()
    this.cartService.addToCart(this.cartService.singleCustomProductObj, 'edit_local_list');
  }

  cancelModal() {
    this._contextService.getCurrentContext()
  }
}
