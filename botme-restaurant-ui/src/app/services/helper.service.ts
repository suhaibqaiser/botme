import { Injectable, isDevMode } from '@angular/core';
import { DataDogLoggingService } from './datadog.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private logger: DataDogLoggingService) {
  }

  resolveProductImage(productObj: any) {
    return (productObj && productObj.productImage && productObj.productImage.length) ? 'assets/images/products/' + productObj.productImage[0] : 'assets/images/product-1.png'
  }

  public log(type: string, message: any): void {


    if (type === 'info') {
      if (!isDevMode()) {
        this.logger.info(message);
      }
      console.info(message);

    } else if (type === 'warn') {
      if (!isDevMode()) {
        this.logger.warn(message);
      }
      console.warn(message);

    } else if (type === 'error') {
      if (!isDevMode()) {
        this.logger.error(message);
      }
      console.error(message);
    } else {
      if (!isDevMode()) {
        this.logger.info(message);
      }
      console.log(message);
    }


  }
}
