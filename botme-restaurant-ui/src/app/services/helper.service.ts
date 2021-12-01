import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() {
  }

  resolveProductImage(productObj: any) {
    return (productObj && productObj.productImage && productObj.productImage.length) ? 'assets/images/products/' + productObj.productImage[0] : 'assets/images/product-1.png'
  }
}
