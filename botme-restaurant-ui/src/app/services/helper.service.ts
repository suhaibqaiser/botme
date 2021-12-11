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
