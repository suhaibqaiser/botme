import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {SocketService} from "../../../services/socket.service";
import {HelperService} from "../../../services/helper.service";
import {ContextService} from "../../../services/context.service";
import {BotmeClientService} from "../../../services/botme-client.service";

@Component({
  selector: 'app-customize-product-modal',
  templateUrl: './customize-product-modal.component.html',
  styleUrls: ['./customize-product-modal.component.scss']
})
export class CustomizeProductModalComponent implements OnInit {

  constructor(private _clientService:BotmeClientService,private _contextService: ContextService, public _helperService: HelperService, public cartService: CartService, public _socketService: SocketService) {
  }

  ngOnInit(): void {
  }

  addToCart() {
    this._contextService.getCurrentContext()
    this.cartService.addToCart(this.cartService.singleCustomProductObj, 'add_local_list');
  }

  editToCart() {
    this._contextService.getCurrentContext()
    let type = this._clientService.getCookie().isLoggedIn ? 'edit_db' : 'edit_local_list'
    this.cartService.addToCart(this.cartService.singleCustomProductObj, type);
  }

  cancelModal() {
    this._contextService.getCurrentContext()
  }
}
