import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BotmeClientService} from "../../../services/botme-client.service";


@Component({
  selector: 'app-headingbanner',
  templateUrl: './headingbanner.component.html',
  styleUrls: ['./headingbanner.component.scss']
})
export class HeadingbannerComponent implements OnInit {

  currentRoute: string = "";

  constructor(public botMeClientService: BotmeClientService, private router: Router) {
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url.replace(/\//g, "").replace("-", " ");
    if (this.currentRoute.indexOf('?') > 0) {
      this.currentRoute = this.currentRoute.substr(0, this.currentRoute.indexOf('?'))
    }
    console.log(this.currentRoute)
    if (this.currentRoute !== 'online shop') {
      localStorage.setItem('searchList', JSON.stringify([]))
    }
    if (this.currentRoute == 'online shop') this.currentRoute = 'Place Order'

  }
}
