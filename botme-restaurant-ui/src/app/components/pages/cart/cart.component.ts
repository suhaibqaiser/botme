import {Component, OnInit} from '@angular/core';
import {ContextService} from "../../../services/context.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(private _contextService: ContextService) {

  }

  ngOnInit(): void {
    this._contextService.getCurrentContext()
  }

}
