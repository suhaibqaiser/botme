import {Component, OnInit} from '@angular/core';
import {ProductSuggestionService} from "../../../services/product-suggestion.service";
import {MenuService} from "../../../services/menu.service";
import {HelperService} from "../../../services/helper.service";
import {FormControl} from "@angular/forms";
import {SocketService} from "../../../services/socket.service";
import {BotmeClientService} from "../../../services/botme-client.service";
import {ToastService} from "../../../services/toast.service";
import {ContextService} from "../../../services/context.service";
import {CartService} from "../../../services/cart.service";
declare var $: any;
@Component({
  selector: 'app-sugestion-section',
  templateUrl: './sugestion-section.component.html',
  styleUrls: ['./sugestion-section.component.scss']
})
export class SugestionSectionComponent implements OnInit {

  suggestionControl = new FormControl('')

  constructor(private _contextService: ContextService, private cartService: CartService, private _toastService: ToastService, public _clientService: BotmeClientService, private _socketService: SocketService, public _productSuggestionService: ProductSuggestionService, private menuservice: MenuService, public _helperService: HelperService) {
    this._contextService.getCurrentContext()
  }


  async ngOnInit() {
    this.getProducts()
  }

  async getProducts() {
    this._productSuggestionService.loader = true
    this.menuservice.getProducts()
      .subscribe(result => {
        this._productSuggestionService.products = result.payload
        this._productSuggestionService.loader = false
      });
  }

  sendSuggestion() {
    console.log(this.suggestionControl.value)
    if (!this.suggestionControl.value) {
      this._toastService.setToast({
        description: 'Suggestion is required.',
        type: 'danger'
      })
      return
    }
    this._productSuggestionService.suggestedProductList = []
    const isVoiceToggleOn = (this._clientService.getCookie() && this._clientService.getCookie().isVoiceToggleOn === 'false') ? false : true
    if (!isVoiceToggleOn) {
      this._productSuggestionService.loader = true
      this._socketService.sendMessage('communication', this.suggestionControl.value)
    }
  }

  isVoiceToggleOn() {
    return (this._clientService.getCookie() && this._clientService.getCookie().isVoiceToggleOn === 'false') ? false : true
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
}
