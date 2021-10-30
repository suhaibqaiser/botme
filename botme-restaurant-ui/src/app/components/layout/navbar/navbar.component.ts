import {Component, OnInit} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  products: [] = []

  constructor(private cartService: CartService, private _socketService: SocketService) {
  }

  ngOnInit(): void {
    this.getCartProducts()
  }

  getCartProducts() {
    this.cartService.getCartProducts().subscribe(
      res => {
        this.products = JSON.parse(res)
      }
    )
  }

  getCartProductCount() {
    return this.products.length
  }

  showCartModal() {
    this._socketService.currentContextObj.sectionId = 'sectionId-cart-modal'
    document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:block')
  }

}
