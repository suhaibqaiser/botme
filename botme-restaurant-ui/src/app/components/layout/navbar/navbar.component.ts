import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  products: [] = []

  constructor(private cartService: CartService) { }

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

  showCartModal(){
    document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:block')
  }

}
