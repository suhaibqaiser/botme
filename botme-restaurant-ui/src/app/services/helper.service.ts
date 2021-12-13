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

  timeConvert(time: any) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    let partOne = time.join('').split(':'); // return adjusted time or original string
    let partTwo = partOne[2].split('0')
    partOne = partOne[0] + ':' + partOne[1]
    partOne += ' ' + partTwo[2]
    return partOne
  }
}
