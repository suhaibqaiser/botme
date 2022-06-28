import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BotmeClientService} from "../../../services/botme-client.service";
import {ToastService} from "../../../services/toast.service";
import {Router} from "@angular/router";
import {HelperService} from "../../../services/helper.service";

@Component({
  selector: 'app-customer-login-section',
  templateUrl: './customer-login-section.component.html',
  styleUrls: ['./customer-login-section.component.scss']
})
export class CustomerLoginSectionComponent implements OnInit {
  loginForm = new FormGroup({
    clientID: new FormControl('', [Validators.required]),
    clientSecret: new FormControl('', [Validators.required]),
    clientType: new FormControl('customer'),
    voiceType: new FormControl('cloud-voice', Validators.required)
  })
  loader = false

  constructor(private router: Router, private _toastService: ToastService, private _botMeClientService: BotmeClientService, public _helperService: HelperService) {
  }

  ngOnInit(): void {
  }

  login() {

    if (!this.loginForm.get('clientID')?.value || !this.loginForm.get('clientSecret')?.value) {
      this._toastService.setToast({
        description: (!this.loginForm.get('clientID')?.value) ? 'Client ID is required!' : 'Client Secret is required!',
        type: 'danger'
      })
      return
    }

    this.loader = true
    this._botMeClientService.reSetCookie()
    this._botMeClientService.loginBotMeClientApi(JSON.parse(JSON.stringify(this.loginForm.value))).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this._toastService.setToast({
            description: 'Successfully Login.',
            type: 'success'
          })

          this._botMeClientService.setCookie('clientToken', res.payload.clientToken)
          this._botMeClientService.setCookie('clientName', res.payload.clientName)
          this._botMeClientService.setCookie('clientID', res.payload.clientID)
          this._botMeClientService.setCookie('sessionId', res.payload.sessionId)
          this._botMeClientService.setCookie('isLoggedIn', res.payload.isLoggedIn)
          this._botMeClientService.setCookie('clientDebug', (res.payload.clientDebug) ? "yes" : "no")
          this._botMeClientService.setCookie('voiceType', this.loginForm.get('voiceType')?.value)
          this._botMeClientService.setCookie('voiceTimeout', res.payload.clientVoiceTimeout)
          this._botMeClientService.setCookie('restaurantId', res.payload.restaurantId)
          this._botMeClientService.setCookie('clientVoiceEnabled', (res.payload.clientVoiceEnabled) ? "yes" : "no")
          this._botMeClientService.setCookie('clientType', res.payload.clientType)
          this._botMeClientService.setCookie('clientEmail', res.payload.clientEmail)
          this._helperService.navigateTo('home')
          return
        }

        this._toastService.setToast({
          description: res.message,
          type: res.status
        })

        this.loader = false
        return;
      },
      (err: any) => {
        console.error(err)
        this.loader = false
        this._toastService.setToast({
          description: 'Bad Request.',
          type: 'danger'
        })
      }
    )
  }
}
