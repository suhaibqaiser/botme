import {Injectable} from '@angular/core';
import {HelperService} from "./helper.service";
import {FormControl} from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class ProductSuggestionService {

  suggestedProductList: any = []
  suggestionControl = new FormControl('')
  categories: any = []
  products: any = []
  loader: any = false
  keywords: any = []

  constructor(private _helperService: HelperService) {
  }

  async setSuggestedProducts(inputText: any = '', cartList: any = [], keywords: any = []) {

    console.log('cartList =>', cartList)
    console.log('keywords =>', keywords)
    console.log('setSuggestedProducts =>', this.products)

    this.suggestionControl.setValue(inputText)
    if (cartList && cartList.length) {
      cartList.forEach((cartItem: any) => {
        const product = this.products.find((item: any) => item.productId === cartItem.productId)
        this.suggestedProductList.push(JSON.parse(JSON.stringify(this._helperService.setSingleCustomizeProduct(product, cartItem))))
      })
    }

    for (let key in keywords) {
      if (keywords.hasOwnProperty(key) && !keywords[key].length) {
        delete keywords[key]
      }
    }

    this.keywords = keywords

    console.log('suggestedProductList =>', this.suggestedProductList)
  }

  reset() {
    console.log('reset')
    this.suggestedProductList = []
    this.keywords = []
    this.loader = false
  }
}
