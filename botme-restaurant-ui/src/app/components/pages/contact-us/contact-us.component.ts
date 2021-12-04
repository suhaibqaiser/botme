import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(private _socketService: SocketService) {
  }

  ngOnInit(): void {
    this._socketService.getCurrentContext()
  }

}
