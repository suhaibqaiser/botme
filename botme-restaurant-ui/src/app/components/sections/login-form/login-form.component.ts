import {Component, OnInit} from '@angular/core';
import {BotmeClientService} from "../../../services/botme-client.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastService} from "../../../services/toast.service";
import {HelperService} from "../../../services/helper.service";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm = new FormGroup({
    clientID: new FormControl('', [Validators.required]),
    clientSecret: new FormControl('', [Validators.required]),
    voiceType: new FormControl('cloud-voice', Validators.required)
  })
  _voiceType: string = this._botMeClientService.getVoiceType()
  userVoice: string = ''
  botVoice: string = ''
  loader = false

  constructor(private _toastService: ToastService, public _botMeClientService: BotmeClientService, public router: Router, public _helperService: HelperService) {
  }

  ngOnInit(): void {
  }

  login() {
    this.loader = true
    this._botMeClientService.reSetCookie()
    this._botMeClientService.loginBotMeClientApi(this.loginForm.value).subscribe(
      (res: any) => {
        if (res.status) {
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
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        } else {
          this._toastService.setToast({
            description: 'Invalid credentials.',
            type: 'danger'
          })
        }
        this.loader = false
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

  logout() {
    this.loader = true
    this._botMeClientService.logutAPI(this._botMeClientService.getCookieByKey('sessionId')).subscribe(res => {
      if (res.status === 'success') {
        this._botMeClientService.reSetCookie()
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
        this.loader = false
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
