import { Component, OnInit } from '@angular/core';
import {BotmeClientService} from "../../../services/botme-client.service";

@Component({
  selector: 'app-subscribe-section',
  templateUrl: './subscribe-section.component.html',
  styleUrls: ['./subscribe-section.component.scss']
})
export class SubscribeSectionComponent implements OnInit {

  constructor(public botMeClientService:BotmeClientService) { }

  ngOnInit(): void {
  }

}
