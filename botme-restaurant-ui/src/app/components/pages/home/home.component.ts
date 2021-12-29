import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {ContextService} from "../../../services/context.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public _contextService: ContextService) {
  }

  ngOnInit(): void {
    this._contextService.getCurrentContext()
  }

}
