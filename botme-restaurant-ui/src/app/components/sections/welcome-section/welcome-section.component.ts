import {Component, OnInit} from '@angular/core';
import {HelperService} from "../../../services/helper.service";

@Component({
  selector: 'app-welcome-section',
  templateUrl: './welcome-section.component.html',
  styleUrls: ['./welcome-section.component.scss']
})
export class WelcomeSectionComponent implements OnInit {

  constructor(public _helperService: HelperService) {
  }

  ngOnInit(): void {
  }

}
