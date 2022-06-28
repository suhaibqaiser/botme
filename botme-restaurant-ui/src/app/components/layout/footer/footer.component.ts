import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {HelperService} from "../../../services/helper.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public cartService: CartService, public _helperService: HelperService) {
  }

  ngOnInit(): void {
  }

}
