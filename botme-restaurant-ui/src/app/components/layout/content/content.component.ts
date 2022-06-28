import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BotmeClientService} from "../../../services/botme-client.service";
import {SocketService} from "../../../services/socket.service";
import {ToastService} from "../../../services/toast.service";
import {CookieService} from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HelperService} from "../../../services/helper.service";


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  private readonly publicKey = "BASpDNILoNMWYHhzrhEY6QKqFZqH8FOtybXu_3fqVk1lxbWNYU1VAmigQuN2u8lahgGOiW-FGHrWmrDwpbQ1-l0"

  restaurantUrl = environment.apiRestaurantUrl

  queryParams: any = {}

  constructor(private _toastService:ToastService,private _route: ActivatedRoute, public socketService: SocketService, public botMeClientService: BotmeClientService, private router: Router, private actRouter: ActivatedRoute, private cookieService: CookieService,private _helperService:HelperService) {
    console.log('ContentComponent')
  }

  async ngOnInit() {
    setTimeout(async () => {
      await this._route.queryParams.subscribe(param => {
        console.log(' params =>', param)
        this.queryParams = {
          verification_token: (param && param.verification_token) ? param.verification_token : '',
          clientID: (param && param.clientID) ? param.clientID : ''
        }
      })

      console.log('query params =>', this.queryParams)

      if (this.queryParams.verification_token && this.queryParams.clientID) {
        this.verifyAccount()
      }
    }, 1000)

    console.log("client loggin ==>",this.botMeClientService.getCookie().isLoggedIn)
    if(this.botMeClientService.getCookie().isLoggedIn) {
      this.allowNotification()
    }
  }

  onActivate(event: any) {
    window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }

  verifyAccount() {

    this.botMeClientService.verifyClientAccount(this.queryParams.verification_token, this.queryParams.clientID).subscribe(
      (res: any) => {
        this._toastService.setToast({
          description: res.message,
          type: res.status
        })
      }
    )
  }
  allowNotification(){
    if (Notification.permission === 'default'){
      Notification.requestPermission().then((perm) => {
        if (Notification.permission === "granted"){
          this.regWorker()
        }
        else{
          alert("please allow notifications.");
        }
      });
    }
    else if (Notification.permission === "granted"){
      console.log("permission granted")
      this.regWorker()
    }
    else {
      alert("please allow notifications.");
    }
    }
  async regWorker() {
    if('serviceWorker' in navigator){

      console.log(this.publicKey)
      const register = await navigator.serviceWorker.register('/sw.js',{scope: '/'})
      let subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.publicKey
      })
      var subscriptionWrapper = {
        "subscription":subscription,
        "clientId": this.cookieService.get("clientID"),
      }
      console.log("Subscription==>",subscriptionWrapper)

      fetch(this.restaurantUrl + '/notification/subscribe/save',{
        method:'POST',
        body: JSON.stringify(subscriptionWrapper),
        headers: {
          'content-type': 'application/json'
        }
      });
    }
  }
}
