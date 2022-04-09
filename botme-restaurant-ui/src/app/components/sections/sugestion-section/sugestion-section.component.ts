import {Component, OnInit} from '@angular/core';
import {ProductSuggestionService} from "../../../services/product-suggestion.service";
import {MenuService} from "../../../services/menu.service";
import {HelperService} from "../../../services/helper.service";

@Component({
  selector: 'app-sugestion-section',
  templateUrl: './sugestion-section.component.html',
  styleUrls: ['./sugestion-section.component.scss']
})
export class SugestionSectionComponent implements OnInit {

  constructor(public _productSuggestionService: ProductSuggestionService, private menuservice: MenuService, public _helperService: HelperService) {
  }


  async ngOnInit() {
    this.getProducts()
  }

  async getProducts() {
    this._productSuggestionService.loader = true
    this.menuservice.getProducts()
      .subscribe(result => {
        this._productSuggestionService.products = result.payload
        this._productSuggestionService.loader = false
      });
  }
}
