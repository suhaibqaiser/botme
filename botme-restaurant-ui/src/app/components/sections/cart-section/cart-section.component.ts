import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {MenuService} from 'src/app/services/menu.service';
import {HelperService} from "../../../services/helper.service";
import {ContextService} from "../../../services/context.service";
import {SocketService} from "../../../services/socket.service";
import {FormControl} from "@angular/forms";
import {BotmeClientService} from "../../../services/botme-client.service";

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
              private MenuService: MenuService,
              public _helperService: HelperService,
              private _contextService: ContextService,
              private _socketService: SocketService,
              public _clientService: BotmeClientService
  ) {
    this.orderType.setValue(this._clientService.getCookie().orderType ? this._clientService.getCookie().orderType : '')
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
    this.cartService.addToCart(this.cartService.cartProduct, true, 'place-order')
  }

  openModal() {
    if (!this._clientService.getCookie().orderType) {
      $('#order_type_modal').modal('show')
    }
  }
}
