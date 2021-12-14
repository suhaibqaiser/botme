import {Component, OnInit} from '@angular/core';
import {HelperService} from "../../../services/helper.service";

@Component({
  selector: 'app-contact-section',
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss']
})
export class ContactSectionComponent implements OnInit {

  constructor(private _helper: HelperService) {
    clearTimeout(this._helper.timer)
  }

  ngOnInit(): void {
  }

}
