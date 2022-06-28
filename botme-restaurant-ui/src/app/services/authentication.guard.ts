import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {BotmeClientService} from "./botme-client.service";
import {HelperService} from "./helper.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(public _helperService: HelperService, private _botMeClientService: BotmeClientService, private _router: Router) {
  }

  canActivate(): boolean {
    if (this._botMeClientService.isCookieTokenValid()) {
      return true
    } else {
      this._helperService.navigateTo('home')
      return false
    }
  }

}
