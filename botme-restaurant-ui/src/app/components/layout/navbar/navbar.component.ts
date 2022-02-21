import {Component, OnInit} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {SocketService} from "../../../services/socket.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BotmeClientService} from "../../../services/botme-client.service";
import {Router} from "@angular/router";
import {DeviceDetectorService} from "ngx-device-detector";
import {ContextService} from "../../../services/context.service";
import {MenuService} from "../../../services/menu.service";
import {HelperService} from "../../../services/helper.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  products: [] = []
  _voiceType: string = this._botMeClientService.getVoiceType()
  userVoice: string = ''
  botVoice: string = ''

  constructor(public router: Router,
              public socketService: SocketService,
              public _botMeClientService: BotmeClientService,
              private cartService: CartService,
              private _menuService: MenuService,
              private _contextService: ContextService,
              public _helperService: HelperService
  ) {
    document.getElementsByClassName('cart-modal-wrapper')[0]?.setAttribute('style', 'display:none')
  }

  ngOnInit(): void {
    this.socketService.messages.subscribe((message: any) => {
      this.botVoice = message.text
      this.userVoice = message.inputText;
    });
  }

  getCartProductCount() {
    return this.cartService.cartProduct.length
  }

  showCartModal() {
    this._contextService.currentContextObj.pageId = 'pageId-cart-modal'
    this._contextService.currentContextObj.sectionId = 'sectionId-cart-modal'
    document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:block')
  }

  setVoiceType() {
    this._botMeClientService.setCookie('voiceType', this._voiceType)
  }

  reload() {
    location.reload()
  }

  getOrderType() {
    let id = ''

    if(!this._helperService.getOrderTypeOnAuthBasis()) {
      return ''
    }

    // if (this._helperService.getOrderTypeOnAuthBasis() && this._helperService.getOrderTypeOnAuthBasis() === 'dine_in') {
    //   id = this._botMeClientService.getCookie().reservationLabel ? this._botMeClientService.getCookie().reservationLabel : ''
    // } else if(this._helperService.getOrderTypeOnAuthBasis()){
    //   id = this._botMeClientService.getCookie().orderLabel ? this._botMeClientService.getCookie().orderLabel : ''
    // }
    id = this._botMeClientService.getCookie().orderLabel ? this._botMeClientService.getCookie().orderLabel : ''
    return this._helperService.getOrderTypeOnAuthBasis().replace(/_/g, " ") + ' : ' +  id
  }
}
