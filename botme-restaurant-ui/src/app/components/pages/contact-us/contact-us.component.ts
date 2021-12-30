import {Component, OnInit} from '@angular/core';
import {ContextService} from "../../../services/context.service";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(private _contextService: ContextService) {
  }

  ngOnInit(): void {
    this._contextService.getCurrentContext()
  }

}
