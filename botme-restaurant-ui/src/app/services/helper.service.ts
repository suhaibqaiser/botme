import {Injectable, isDevMode} from '@angular/core';
import {DataDogLoggingService} from './datadog.service';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  timer: any

  constructor(private _router: Router, private logger: DataDogLoggingService) {
  }

  resolveProductImage(productObj: any) {
    return (productObj && productObj.productImage && productObj.productImage.length) ? 'assets/images/products/' + productObj.productImage[0] : 'assets/images/product-1.png'
  }

  public log(type: string, message: any): void {

    let devMode = isDevMode()
    console.log("Development: " + devMode)
    if (type === 'info') {
      if (!devMode) {
        this.logger.info(message);
      }
      console.info(message);

    } else if (type === 'warn') {
      if (!devMode) {
        this.logger.warn(message);
      }
      console.warn(message);

    } else if (type === 'error') {
      if (!devMode) {
        this.logger.error(message);
      }
      console.error(message);
    } else {
      if (!devMode) {
        this.logger.info(message);
      }
      console.log(message);
    }

  }

  timeConvert(time: any) {
    // Check correct time format and split into components
    console.log('time =>', time)
    let reservationTimeCheck = new RegExp('^(0?[1-9]|1[0-2]):([0-5]\\d)\\s?((?:[Aa]|[Pp])\\.?[Mm]\\.?)$');
    if (!time) {
      return null
    }

    if (reservationTimeCheck.test(time)) {
      return time
    }

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


  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * getting the name of current route. e.g '/place-order'
   */
  getCurrentRouteName() {
    return this._router.url
  }

  /**
   * checking is data exists
   * @param value
   */
  requiredCheck(value: any) {
    return value && value.trim().length
  }
}
