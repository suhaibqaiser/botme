import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(private _socketService: SocketService) {

  }

  ngOnInit(): void {
    this._socketService.getCurrentContext()
  }

}
