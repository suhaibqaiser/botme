import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {MenuService} from 'src/app/services/menu.service';
import {HelperService} from "../../../services/helper.service";
import {ContextService} from "../../../services/context.service";
import {SocketService} from "../../../services/socket.service";
import {FormControl} from "@angular/forms";
import {BotmeClientService} from "../../../services/botme-client.service";
import {Router} from "@angular/router";
import {ToastService} from "../../../services/toast.service";
import {OrderService} from "../../../services/order.service";

declare var $: any;

@Component({
  selector: 'app-cart-section',
  templateUrl: './cart-section.component.html',
  styleUrls: ['./cart-section.component.scss']
})
export class CartSectionComponent implements OnInit {

  loader = false
  orderType = new FormControl('')

  constructor(public cartService: CartService,
              private _toastService: ToastService,
              private _router: Router,
              private MenuService: MenuService,
              public _helperService: HelperService,
              private _contextService: ContextService,
              private _socketService: SocketService,
              public _clientService: BotmeClientService,
              public _orderService: OrderService,
              public _botMeService: BotmeClientService
  ) {
    const orderType = this._helperService.getOrderTypeOnAuthBasis()
    this._orderService.selectedOrderButtons = {
      'dine_in': false,
      'pick_up': false,
      'delivery': false
    }
    this._orderService.selectedOrderButtons[orderType] = true
    this._botMeService.setCookie('orderType', orderType)
  }

  ngOnInit(): void {
    this._contextService.getCurrentContext()
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  customizeBillCalculation(product: any) {
    product.productTotalPrice = product.productPrice
    product.productToppings.forEach((item: any) => {
      product.productTotalPrice += Math.ceil(item.productTotalPrice)
    })

    product.productAddons.forEach((item: any) => {
      product.productTotalPrice += item.productTotalPrice
    })
  }

  addProductQuantity(product: any, type: any) {
    this.customizeBillCalculation(product)
    if (type === 'adding') {
      product.productQuantity = product.productQuantity + 1
    } else if (type === 'subtracting') {
      if (product.productQuantity === 1) return
      product.productQuantity = product.productQuantity - 1
    }
    product.productTotalPrice = product.productTotalPrice * product.productQuantity
  }


  editToCart() {
    this.cartService.addToCart(this.cartService.singleCustomProductObj, true);
    document.getElementById("ctaId-show-cart")?.click()
  }

  editFromCart(product: any) {
    this.cartService.slideToShow = 0
    // document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:none')
    this._contextService.currentContextObj.sectionId = 'sectionId-servingSize-productOptions'
    this._contextService.currentContextObj.pageId = 'pageId-product-customize-modal'

    this.cartService.singleCustomProductObj = JSON.parse(JSON.stringify(product))
    this.cartService.singleCustomProductObj.isEditable = true
    this.cartService.selectProductRatesField.setValue(product.productServingSize)
    this._socketService.parentEntity = {
      entityId: product.productId,
      entityValue: product.productName
    }
    $('#pageId-productCustomizeModal').modal('show')
  }

  showProductInfo(product: any) {
    this._contextService.currentContextObj.sectionId = 'sectionId-summary'
    this._contextService.currentContextObj.pageId = 'pageId-product-customize-modal'
    // document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:none')
    this.cartService.singleCustomProductObj = JSON.parse(JSON.stringify(product))
    this.cartService.singleCustomProductObj.isShowInfo = true
    this.cartService.singleCustomProductObj.isEditable = false
    this.cartService.slideToShow = 4
    this.cartService.selectProductRatesField.setValue(product.productServingSize)
    $('#pageId-productCustomizeModal').modal('show')
  }

  placeOrder() {
    this.loader = true
    this.cartService.addToCart(this.cartService.cartProduct, 'add_db')
    this.loader = false
  }

  checkout() {
    const orderType = this._helperService.getOrderTypeOnAuthBasis()
    this._orderService.selectedOrderButtons[orderType] = true
    this._botMeService.setCookie('orderType', orderType)
    if (!this._clientService.getCookie().orderType) {
      this._toastService.setToast({
        description: 'Please select order type!',
        type: 'danger'
      })
      return
    }
    this._router.navigate(['/checkout'])
  }

  openModal() {
    if (!this._clientService.getCookie().orderType) {
      $('#order_type_modal').modal('show')
    }
  }

  selectOrderType(type: any) {
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
}
