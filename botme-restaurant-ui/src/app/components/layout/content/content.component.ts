import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BotmeClientService} from "../../../services/botme-client.service";
import {SocketService} from "../../../services/socket.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  queryParams: any = {}

  constructor(private _toastService:ToastService,private _route: ActivatedRoute, public socketService: SocketService, public botMeClientService: BotmeClientService, private router: Router, private actRouter: ActivatedRoute) {
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
}
