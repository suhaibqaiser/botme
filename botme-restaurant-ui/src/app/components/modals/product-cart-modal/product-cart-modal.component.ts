import {Component, OnInit} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {MenuService} from 'src/app/services/menu.service';
import {Router} from "@angular/router";
import {HelperService} from "../../../services/helper.service";
import {ContextService} from "../../../services/context.service";

declare var $: any;

@Component({
  selector: 'app-product-cart-modal',
  templateUrl: './product-cart-modal.component.html',
  styleUrls: ['./product-cart-modal.component.scss']
})
export class ProductCartModalComponent implements OnInit {

  productIds: string[] = []
  products: any[] = []
  cartProducts: any[] = []
  cartTotal = 0

  constructor(private cartService: CartService,
              private _router: Router,
              private MenuService: MenuService,
              public _helperService: HelperService,
              private _contextService: ContextService) {
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCartProducts();
  }

  getCartProducts() {
    this.cartService.getCartProducts().subscribe(
      res => {
        // this.productIds = JSON.parse(res)
        this.cartProducts = JSON.parse(res)

        this.cartTotal = 0
        // for (let id in this.productIds) {
        //   this.cartProducts.push(this.products.find((product: { productId: string }) => product.productId === this.productIds[id]));
        //   this.cartTotal += this.cartProducts[id].productRate.standard
        // }
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

  calculateTotalPrice(productToppings: any) {
    let price = 0
    if (productToppings && productToppings.length) {
      productToppings.forEach((item: any) => {
        price += item.productTotalPrice
      })
    }
    return this.roundToTwo(price)
  }

  totalCartPrice() {
    let price = 0
    if (this.cartProducts && this.cartProducts.length) {
      this.cartProducts.forEach((item: any) => {
        price += item.productTotalPrice
      })
    }
    return this.roundToTwo(price)
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  editFromCart(product: any) {
    this.cartService.slideToShow = 0
    this._contextService.currentContextObj.sectionId = 'sectionId-servingSize-productOptions'
    this._contextService.currentContextObj.pageId = 'pageId-product-customize-modal'
    this.cartService.setProductRateSize(product)
    document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:none')
    this.cartService.singleCustomProductObj = JSON.parse(JSON.stringify(product))
    this.cartService.singleCustomProductObj.isEditable = true
    this.cartService.selectProductRatesField.setValue(product.productServingSize)
    $('#pageId-productCustomizeModal').modal('show')
  }

  showProductInfo(product: any) {
    this.cartService.setProductRateSize(product)
    this._contextService.currentContextObj.sectionId = 'sectionId-summary'
    this._contextService.currentContextObj.pageId = 'pageId-product-customize-modal'
    document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:none')
    this.cartService.singleCustomProductObj = JSON.parse(JSON.stringify(product))
    this.cartService.singleCustomProductObj.isShowInfo = true
    this.cartService.singleCustomProductObj.isEditable = true
    this.cartService.slideToShow = 4
    this.cartService.selectProductRatesField.setValue(product.productServingSize)
    $('#pageId-productCustomizeModal').modal('show')
  }

  navigateToCart() {
    if (!this.cartProducts.length) return
    this._router.navigate(['/cart'])
  }

  closeCart() {
    document.getElementsByClassName('cart-modal-wrapper')[0]?.setAttribute('style', 'display:none')
    this._contextService.getCurrentContext()
  }

  roundToTwo(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}
