import {Component, OnInit} from '@angular/core';
import {BotmeClientService} from "../../../services/botme-client.service";
import {Router} from "@angular/router";
import {DeviceDetectorService} from "ngx-device-detector";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss']
})
export class ProfileSectionComponent implements OnInit {

  loader = false

  constructor(private _toastService: ToastService, public _deviceService: DeviceDetectorService, public _botMeClientService: BotmeClientService, private _router: Router) {
  }

  ngOnInit(): void {
  }

  logout() {
    this.loader = true
    this._botMeClientService.logutAPI(this._botMeClientService.getCookieByKey('sessionId')).subscribe(res => {
      if (res.status === 'success') {
        this._toastService.setToast({description:'Logout successfully.',type:'success'})
        this._botMeClientService.reSetCookie()
        this._router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      }
      this.loader = false
    })
  }
}
