import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import {BotmeClientService} from "../../../services/botme-client.service";
import {FormControl} from "@angular/forms";
import {ToastService} from "../../../services/toast.service";
import {HelperService} from "../../../services/helper.service";
import {MenuService} from "../../../services/menu.service";
import {CartService} from "../../../services/cart.service";

declare var $: any;

@Component({
  selector: 'app-order-section',
  templateUrl: './order-section.component.html',
  styleUrls: ['./order-section.component.scss']
})
export class OrderSectionComponent implements OnInit {

  constructor(private MenuService: MenuService, private _cartService: CartService, private _menuService: MenuService, public _helperService: HelperService, private _toastService: ToastService, public _orderService: OrderService, private _route: Router, public _botMeService: BotmeClientService) {
    if (this._botMeService.getCookie().isLoggedIn) {
      this.getProducts()
    }
  }

  orderId = new FormControl('')
  loader = false

  ngOnInit(): void {
    this._orderService.selectedOrderButtons[this._helperService.getOrderTypeOnAuthBasis()] = true
  }

  getOrderType() {
    return this._helperService.getOrderTypeOnAuthBasis().replace(/_/g, " ")
  }

  getStatement() {
    return 'Do you have  ' + (['pick_up', 'delivery'].includes(this._helperService.getOrderTypeOnAuthBasis()) ? 'Order' : 'Reservation') + ' Id ?'
  }

  getButtonName() {
    return 'Apply ' + (['pick_up', 'delivery'].includes(this._helperService.getOrderTypeOnAuthBasis()) ? 'Order' : 'Reservation') + ' Id'
  }

  selectOrderType(type: any) {
    this.orderId.reset()
    this._cartService.cartProduct = []
    this._botMeService.setCookie('orderLabel', '')
    this._botMeService.setCookie('customerId', '')
    $('#order_modal').modal('show')
    if (type === 'dine_in') {
      this._orderService.selectedOrderButtons['dine_in'] = true
      this._orderService.selectedOrderButtons['pick_up'] = false
      this._orderService.selectedOrderButtons['delivery'] = false
      this._botMeService.setCookie('orderType', 'dine_in')
    }
    if (type === 'pick_up') {
      this._orderService.selectedOrderButtons['dine_in'] = false
      this._orderService.selectedOrderButtons['pick_up'] = true
      this._orderService.selectedOrderButtons['delivery'] = false
      this._botMeService.setCookie('orderType', 'pick_up')
    }
    if (type === 'delivery') {
      this._orderService.selectedOrderButtons['dine_in'] = false
      this._orderService.selectedOrderButtons['pick_up'] = false
      this._orderService.selectedOrderButtons['delivery'] = true
      this._botMeService.setCookie('orderType', 'delivery')
    }
    return ''
  }

  applyId() {
    if (!this._helperService.requiredCheck(this.orderId.value)) {
      this._toastService.setToast({
        description: this._helperService.getOrderTypeOnAuthBasis() === 'dine_in' ? 'Reservation Id is required.' : 'Order Id is required.',
        type: 'danger'
      })
      return
    }
    this.loader = true
    this._cartService.cartProduct = []
    this._menuService.findOrderByOrderLabel(this.orderId.value).subscribe((res: any) => {
      this._toastService.setToast({
        description: res.message,
        type: res.status
      })
      $('#order_modal').modal('hide')
      this.loader = false
      if (res.status === 'success') {
        const cartList = res.payload.cart
        this._botMeService.setCookie('orderLabel', res.payload.order.orderLabel)
        this._botMeService.setCookie('customerId', res.payload.order.customerId)
        if (cartList && cartList.length) {
          cartList.forEach((cartItem: any) => {
            const product = this._cartService.products.find((item: any) => item.productId === cartItem.productId)
            this._cartService.cartProduct.push(JSON.parse(JSON.stringify(this._helperService.setSingleCustomizeProduct(product, cartItem))))
          })
        }
        this._cartService.cartLoader = false
        this._route.navigate(['/cart'])

        return
      }
      this._botMeService.setCookie('orderLabel', '')
      this._botMeService.setCookie('customerId', '')

    })
  }

  goToRoute(route: any = '') {
    this._route.navigate([route])
    this._botMeService.setCookie('orderLabel', '')
  }

  getProducts(): void {
    this.MenuService.getProducts()
      .subscribe(result => {
        this._cartService.products = result.payload
        this._helperService.productList = result.payload
      });
  }
}
