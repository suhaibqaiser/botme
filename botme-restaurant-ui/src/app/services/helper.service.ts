import {Injectable, isDevMode} from '@angular/core';
import {DataDogLoggingService} from './datadog.service';
import {Router} from "@angular/router";
import {BotmeClientService} from "./botme-client.service";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  timer: any
  orderStatusObject: any = {
    hold: 'hold',
    priced: 'priced',
    ready: 'ready',
    in_process: 'in_process',
    received: 'received',
    notified: 'notified',
    delivered: 'delivered',
    remade: 'remade',
    returned: 'returned'
  }

  fieldErrorsCheckTypes = {
    required: 'required'
  }

  constructor(private _router: Router, private logger: DataDogLoggingService, private _clientService: BotmeClientService) {
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

  /**
   * get resturantid on the basis of login
   */
  getRestaurantIdOnAuthBasis() {
    const cookie = this._clientService.getCookie()
    return (cookie && cookie.isLoggedIn) ? (cookie.restaurantId ? cookie.restaurantId : '') : 'DM-R'
  }

  /**
   * get orderType on the basis of auth
   */
  getOrderTypeOnAuthBasis() {
    const cookie = this._clientService.getCookie()
    return (cookie && cookie.orderType) ? cookie.orderType : ''
  }

  getOrderStatus(type = '') {
    const status = this.orderStatusObject[type]
    return status ? status : ''
  }

  /**
   * get those cart items which has empty cartId
   * @param cartList
   */
  filterCartByCartId(cartList: any = []) {
    return cartList.filter((item: any) => !item.cartId)
  }

  /**
   * Only requiredCheck validation
   * @param control
   */
  requiredCheckReal(control: { value: any; }) {
    const enteredName = control.value;
    const nameCheck = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    return (!nameCheck.test(enteredName) && enteredName) ? {requirements: true} : null;
  }

  checkEmailRegex(control: { value: any; }) {
    const reservationTime = control.value;
    const reservationTimeCheck = new RegExp('^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
    return (!reservationTimeCheck.test(reservationTime) && reservationTime) ? {requirements: true} : null;
  }

  getRequiredCheckError(form: any, formControlName: any, type: any = '', messageList: any = []) {

    if (formControlName === 'clientEmail') {
      return form.get('clientEmail')?.hasError('required') ?
        messageList[0] :
        form.get('clientEmail')?.hasError('requirements') ?
          'Please enter valid email xyz@gmail.com' : '';
    }

    if (type === this.fieldErrorsCheckTypes.required) {
      return form.get(formControlName)?.hasError('required') ?
        messageList[0] : ''
    }

    return ''
  }

}
