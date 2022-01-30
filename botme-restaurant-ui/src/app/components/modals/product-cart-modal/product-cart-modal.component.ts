import {Component, OnInit} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {MenuService} from 'src/app/services/menu.service';
import {Router} from "@angular/router";
import {HelperService} from "../../../services/helper.service";
import {ContextService} from "../../../services/context.service";
import {SocketService} from "../../../services/socket.service";
import {BotmeClientService} from "../../../services/botme-client.service";
import {ToastService} from "../../../services/toast.service";

declare var $: any;

@Component({
  selector: 'app-product-cart-modal',
  templateUrl: './product-cart-modal.component.html',
  styleUrls: ['./product-cart-modal.component.scss']
})
export class ProductCartModalComponent implements OnInit {

  constructor(public cartService: CartService,
              public clientService: BotmeClientService,
              private _router: Router,
              private MenuService: MenuService,
              public _helperService: HelperService,
              private _contextService: ContextService,
              private _socketService: SocketService,
              private _toastService: ToastService) {
  }

  ngOnInit(): void {
    this.cartService.cartLoader = true
    if (this.clientService.getCookie().isLoggedIn && this.clientService.getCookie().orderType && (this.clientService.getCookie().reservationLabel || this.clientService.getCookie().orderLabel)) {
      this.getProducts();
    }
  }

  getCartProducts() {
    this.cartService.cartProduct =[]
    this.MenuService.findAllCartById().subscribe((res: any) => {
      this._toastService.setToast({
        description: res.message,
        type: res.status
      })
      this.cartService.cartLoader = false
      if (res.status === 'success') {
        const cartList = res.payload.cart
        this.clientService.setCookie('orderLabel', res.payload.order.orderLabel)
        this.clientService.setCookie('reservationLabel', res.payload.order.reservationLabel)
        this.clientService.setCookie('orderType', res.payload.order.orderType)
        this.clientService.setCookie('customerId', res.payload.order.customerId)
        if (cartList && cartList.length) {
          cartList.forEach((cartItem: any) => {
            const product = this.cartService.products.find((item: any) => item.productId === cartItem.productId)
            this.cartService.cartProduct.push(JSON.parse(JSON.stringify(this.cartService.setSingleCustomizeProduct(product, cartItem))))
          })
        }
        console.log(this.cartService.cartProduct)
        return
      }
      this.clientService.setCookie('orderLabel', '')
      this.clientService.setCookie('reservationLabel', '')
      this.clientService.setCookie('orderType', '')
      this.clientService.setCookie('customerId', '')

    })
  }

  getProducts(): void {
    this.MenuService.getProducts()
      .subscribe(result => {
        this.cartService.products = result.payload
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
    if (this.cartService.cartProducts && this.cartService.cartProduct.length) {
      this.cartService.cartProduct.forEach((item: any) => {
        price += item.productTotalPrice
      })
    }
    return this.roundToTwo(price)
  }

  removeFromCart(product: any) {
    this.cartService.removeFromCart(product);
  }

  editFromCart(product: any) {
    this.cartService.slideToShow = 0
    this._contextService.currentContextObj.sectionId = 'sectionId-servingSize-productOptions'
    this._contextService.currentContextObj.pageId = 'pageId-product-customize-modal'
    document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:none')
    console.log('product =>', product)
    this.cartService.singleCustomProductObj = JSON.parse(JSON.stringify(product))
    this.cartService.singleCustomProductObj.isEditable = true
    this._socketService.parentEntity = {
      entityId: product.productId,
      entityValue: product.productName
    }

    $('#pageId-productCustomizeModal').modal('show')
  }

  showProductInfo(product: any) {
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
    if (!this.cartService.cartProduct.length) return
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
