import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BotmeClientService} from "../../../services/botme-client.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(public botMeClientService:BotmeClientService,private router: Router, private actRouter: ActivatedRoute) { }

  ngOnInit(): void {
  }

}
