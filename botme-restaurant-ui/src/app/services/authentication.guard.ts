import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {BotmeClientService} from "./botme-client.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private _botMeClientService: BotmeClientService, private _router: Router) {
  }

  canActivate(): boolean {
    if (this._botMeClientService.getCookieToken()) {
      return true
    } else {
      this._router.navigate(['/home'])
      return false
    }
  }

}
