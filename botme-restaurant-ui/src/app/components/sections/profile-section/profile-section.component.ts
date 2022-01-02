import {Component, OnInit} from '@angular/core';
import {BotmeClientService} from "../../../services/botme-client.service";
import {Router} from "@angular/router";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss']
})
export class ProfileSectionComponent implements OnInit {

  constructor(public _deviceService: DeviceDetectorService, public _botMeClientService: BotmeClientService, private _router: Router) {
  }

  ngOnInit(): void {
  }

  logout() {
    this._botMeClientService.logutAPI(this._botMeClientService.getCookieByKey('sessionId')).subscribe(res => {
      console.log(res);
      if (res.status === 'success') {

        this._botMeClientService.reSetCookie()
        this._router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      }

    })
  }
}
