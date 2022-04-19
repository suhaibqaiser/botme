import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ProductSuggestionService {

  suggestedProductList: any = []
  categories: any = []
  products: any = []
  loader: any = false
  keywords: any = []

  constructor() {
  }

  async setSuggestedProducts(idsList: any = [], keywords: any = []) {

    console.log('idsList =>', idsList)
    console.log('keywords =>', keywords)
    console.log('setSuggestedProducts =>', this.products)
    if (idsList && idsList.length) {
      this.suggestedProductList = this.products.filter((item: any, index: any) => item.productId === idsList[index])
      idsList.forEach((item: any) => {
        this.suggestedProductList.push(this.products.find((i: any) => i.productId === item))
      })
    }
    this.keywords = keywords
    this.loader = false
    console.log('suggestedProductList =>', this.suggestedProductList)
  }

  reset(){
    this.suggestedProductList = []
    this.keywords = []
  }
}
