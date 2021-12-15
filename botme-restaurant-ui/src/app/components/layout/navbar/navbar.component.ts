import {Component, OnInit} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {SocketService} from "../../../services/socket.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BotmeClientService} from "../../../services/botme-client.service";
import {Router} from "@angular/router";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  products: [] = []
  loginForm = new FormGroup({
    clientID: new FormControl('', Validators.required),
    clientSecret: new FormControl('', Validators.required),
    voiceType: new FormControl('cloud-voice', Validators.required)
  })
  _voiceType: string = this._botMeClientService.getVoiceType()
  userVoice: string = ''
  botVoice: string = ''

  constructor(public router: Router,
              public socketService: SocketService,
              public _botMeClientService: BotmeClientService,
              private cartService: CartService,
              public _deviceService: DeviceDetectorService,
              private _socketService: SocketService) {
    document.getElementsByClassName('cart-modal-wrapper')[0]?.setAttribute('style', 'display:none')
  }

  ngOnInit(): void {
    this.getCartProducts()
    this.socketService.messages.subscribe((message: any) => {
      this.botVoice = message.text
      this.userVoice = message.inputText;
    });

  }

  login() {
    this._botMeClientService.loginBotMeClientApi(this.loginForm.value).subscribe(
      (res: any) => {
        if (res.status) {
          this._botMeClientService.setCookie('clientToken', res.payload.clientToken)
          this._botMeClientService.setCookie('clientName', res.payload.clientName)
          this._botMeClientService.setCookie('clientID', res.payload.clientID)
          this._botMeClientService.setCookie('sessionId', res.payload.sessionId)
          this._botMeClientService.setCookie('isLoggedIn', res.payload.isLoggedIn)
          this._botMeClientService.setCookie('clientDebug', (res.payload.clientDebug) ? "yes" : "no")
          this._botMeClientService.setCookie('voiceType', this.loginForm.get('voiceType')?.value)
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        } else {
          alert('Invalid credentials')
        }
      },
      (err: any) => {
        console.error(err)
        alert('Invalid credentials')
      }
    )
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
    this._socketService.currentContextObj.pageId = 'pageId-cart-modal'
    this._socketService.currentContextObj.sectionId = 'sectionId-cart-modal'
    document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:block')
  }

  logout() {
    this._botMeClientService.logutAPI(this._botMeClientService.getCookieByKey('sessionId')).subscribe(res => {
      console.log(res);
      if (res.status === 'success') {

        this._botMeClientService.reSetCookie()
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      }

    })
  }

  setVoiceType() {
    this._botMeClientService.setCookie('voiceType', this._voiceType)
  }

  reload() {
    location.reload()
  }
}
