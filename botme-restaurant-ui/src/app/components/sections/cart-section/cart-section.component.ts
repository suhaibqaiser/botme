import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {MenuService} from 'src/app/services/menu.service';

@Component({
  selector: 'app-cart-section',
  templateUrl: './cart-section.component.html',
  styleUrls: ['./cart-section.component.scss']
})
export class CartSectionComponent implements OnInit {
  productIds: string[] = []
  products: any[] = []
  cartProducts: any[] = []
  cartTotal = 0

  constructor(private cartService: CartService,
              private MenuService: MenuService) {
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCartProducts();
  }

  getCartProducts() {
    this.cartService.getCartProducts().subscribe(
      res => {
        this.productIds = JSON.parse(res)
        this.cartProducts = []
        this.cartTotal = 0
        for (let id in this.productIds) {
          this.cartProducts.push(this.products.find((product: { productId: string }) => product.productId === this.productIds[id]));
          this.cartTotal += this.cartProducts[id].productRate.standard
        }
        console.log(this.cartProducts)
      }
    )
  }

  getProducts(): void {
    this.MenuService.getProducts()
      .subscribe(result => {
        this.products = result.payload
        this.getCartProducts();
      });
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

}
