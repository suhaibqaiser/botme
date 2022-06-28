import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {CtaService} from './services/cta.service';
import {SocketService} from './services/socket.service';
import {HelperService} from "./services/helper.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'botme-restaurant-ui';

  constructor(private socketService: SocketService,
              private ctaService: CtaService,
              private router: Router,
              public _helperService: HelperService) {

    this.socketService.messages.subscribe(r => {
      let res: any = r
      if (res.status === 'success' && res.message.ctaId) {
        this.ctaService.callToAction(res.message.ctaId);
      } else if (res.status === 'success' && res.message.searchText) {
        this.ctaService.searchProduct(res.message.searchText);
      } else if (res.status === 'success' && res.message.navLink) {

        if (res.message.navLink === 'menu') {
          this._helperService.navigateTo('online-shop')
        }
        if (res.message.navLink === 'reservation') {
          this._helperService.navigateTo('reservations')
        }
      }
    })
  }
}
