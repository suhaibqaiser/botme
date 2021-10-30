import {Component, OnInit} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {SocketService} from "../../../services/socket.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BotmeClientService} from "../../../services/botme-client.service";

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
    clientDeviceId: new FormControl('', Validators.required)
  })

  constructor(private _botMeClientService: BotmeClientService, private cartService: CartService, private _socketService: SocketService) {
  }

  ngOnInit(): void {
    this.getCartProducts()
  }

  login() {
    this._botMeClientService.loginBotMeClientApi(this.loginForm.value).subscribe(
      (res: any) => {
        if (res.status) {
          this._botMeClientService.setCookie(res.payload.clientName)
        } else {
          alert('Invalid Record')
        }
      },
      (err: any) => {
        console.log(err)
        alert('Invalid Record')
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
    this._socketService.currentContextObj.sectionId = 'sectionId-cart-modal'
    document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:block')
  }

}
