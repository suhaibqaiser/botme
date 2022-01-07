import {Component, OnInit} from '@angular/core';
import {BotmeClientService} from "../../../services/botme-client.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm = new FormGroup({
    clientID: new FormControl('', Validators.required),
    clientSecret: new FormControl('', Validators.required),
    voiceType: new FormControl('cloud-voice', Validators.required)
  })
  _voiceType: string = this._botMeClientService.getVoiceType()
  userVoice: string = ''
  botVoice: string = ''

  constructor(public _botMeClientService: BotmeClientService, public router: Router,) {
  }

  ngOnInit(): void {
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
          this._botMeClientService.setCookie('voiceTimeout', res.payload.clientVoiceTimeout)
          this._botMeClientService.setCookie('restaurantId', res.payload.restaurantId)
          this._botMeClientService.setCookie('clientVoiceEnabled', (res.payload.clientVoiceEnabled) ? "yes" : "no")
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
