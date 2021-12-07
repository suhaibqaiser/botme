import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BotmeClientService} from "../../../services/botme-client.service";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(public socketService: SocketService, public botMeClientService: BotmeClientService, private router: Router, private actRouter: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  onActivate(event: any) {
    window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)

  }
}
