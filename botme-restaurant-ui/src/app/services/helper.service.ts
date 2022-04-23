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

  productList:any = []

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

  setSingleCustomizeProduct(product: any, cartProduct: any = {}) {
    let productServingSizeList: any = []

    productServingSizeList = this.getSelectedServingSize(product.productRate, cartProduct.productRate)

    return {
      _id: cartProduct._id,
      restaurantId: cartProduct.restaurantId,
      orderLabel: cartProduct.orderLabel,
      cartId: cartProduct.cartId,
      productName: product.productName,
      productId: product.productId,
      productImage: product.productImage,
      productRate: product.productRate,
      productServingSize: productServingSizeList,
      productOptions: this.getSelectedProductOptions(product.productOptions, cartProduct.productOptions),
      productIngredients: this.getSelectedProductIngredient(product.productIngredients, cartProduct.productIngredients),
      productFlavors: this.getSelectedProductFlavor(product.productFlavor, cartProduct.productFlavor),
      productAddons: this.getSelectedProductProportion(cartProduct.productProportion),
      productToppings: this.getSelectedProductToppings(product.productToppings, cartProduct.productToppings),
      productQuantity: (cartProduct && cartProduct.productQuantity) ? cartProduct.productQuantity : 1,
      status: cartProduct.status,
      productAttributes: product.productAttributes,
      productNutrition: product.productNutrition,
      productPrice: this.roundToTwo(productServingSizeList[0].serving_price),
      productTotalPrice: (cartProduct.productTotalPrice) ? cartProduct.productTotalPrice : this.roundToTwo(productServingSizeList[0].serving_price),
      cartDiscount: cartProduct.cartDiscount,
      cartTotal: cartProduct.cartTotal
    }
  }

  /**
   * get the user selected product options
   * @param productOptionsList
   * @param productOptions
   */
  getSelectedProductOptions(productOptionsList: any = [], productOptions: any = []) {
    console.log('productOptionsList => ', !productOptionsList.length)

    if (!productOptionsList.length) return []
    console.log('after')

    let list = productOptionsList.reduce((prev: any, next: any) => {
      return [...prev, ...next]
    })


    if (list && list.length) {
      return list.map((item: any) => {
          let obj = this.getProductById(item)
          return {
            productId: obj.productId,
            productName: obj.productName,
            productImage: this.resolveProductImage(obj),
            selected: (productOptions && productOptions.length) ? !!productOptions.find((dbItem: any) => obj.productId === dbItem.productId) : false,
          }
        }
      )
    }
  }

  /**
   * get user selected product ingredients
   * @param productIngredientList
   * @param productIngredient
   */
  getSelectedProductIngredient(productIngredientList: any = [], productIngredient: any = []) {
    let list = []
    if (productIngredientList && productIngredientList.length) {
      list = productIngredientList.map((item: any) => {
        let obj = this.getProductById(item)
        return {
          productId: obj.productId,
          productName: obj.productName,
          productImage: this.resolveProductImage(obj),
          selected: (productIngredient && productIngredient.length) ? !!productIngredient.find((dbItem: any) => obj.productId === dbItem.productId) : true,
        }
      })

      return list.filter((item: any) => item.productId && item.productId.length)
    }
  }

  /**
   * get user selected select serving size
   * @param productRateList
   */
  getSelectedServingSize(productRateList: any = [], productRate: any = {}) {
    console.log('getSelectedServingSize =>', productRateList, productRate)
    let keysList = Object.keys(productRateList)
    let priceList = keysList.map((item: any, index) => {
      return {
        serving_size_name: item,
        selected: productRate[item] ? true : false,
        serving_price: productRateList[item]
      }
    })

    let check = priceList.filter((item: any) => item.selected === true).length
    if (!check) {
      priceList[0].selected = true
    }
    return priceList
  }

  /**
   * getting the modified list of user selected flavor
   * @param productFlavorList
   * @param productFlavorName
   */
  getSelectedProductFlavor(productFlavorList: any = [], productFlavorName: any = '') {
    if (productFlavorList && productFlavorList.length) {
      let list = productFlavorList.map((item: any) => {
        return {
          flavorName: item,
          selected: (productFlavorName) ? (item === productFlavorName) : false
        }
      })

      if (list && !(!!list.filter((item: any) => item.selected == true).length)) {
        list[0].selected = true
      }

      return list
    }
  }

  /**
   * get user selected addons list
   * @param productProportion
   */
  getSelectedProductProportion(productProportion: any = []) {
    let productList = this.getProductByType('Addon')
    let productProportionIdList = productProportion.map((item: any) => {
      return item.productId
    })
    console.log('getSelectedProductProportion =>', productList, productProportionIdList, productProportion)
    if (productList && productList.length) {
      return productList.map((item: any) => {
        const selectedProduct = productProportion.find((product: any) => product.productId === item.productId)
        return {
          productId: item.productId,
          productName: item.productName,
          productImage: this.resolveProductImage(item),
          selected: (productProportionIdList) ? productProportionIdList.includes(item.productId) : false,
          productQuantity: (selectedProduct && selectedProduct.productQuantity) ? selectedProduct.productQuantity : 0,
          productPrice: this.roundToTwo(item.productRate.standard),
          productTotalPrice: (selectedProduct && selectedProduct.productQuantity) ? (selectedProduct.productQuantity * this.roundToTwo(item.productRate.standard)) : 0,
        }
      })
    }
  }

  /**
   * get user selected product topping
   * @param productToppingsList
   * @param productToppings
   */
  getSelectedProductToppings(productToppingsList: any = [], productToppings: any = []) {
    let productToppingsIdList = productToppings.map((item: any) => {
      return item.productId
    })
    if (productToppingsList && productToppingsList.length) {
      return productToppingsList.map((item: any) => {
        let obj = this.getProductById(item)
        const selectedProduct = productToppings.find((product: any) => product.productId === obj.productId)
        return {
          productId: obj.productId,
          productName: obj.productName,
          productImage: this.resolveProductImage(obj),
          selected: (productToppingsIdList) ? productToppingsIdList.includes(obj.productId) : false,
          productQuantity: (selectedProduct && selectedProduct.productQuantity) ? selectedProduct.productQuantity : 0,
          productPrice: this.roundToTwo(obj.productRate.standard),
          productTotalPrice: (selectedProduct && selectedProduct.productQuantity) ? (selectedProduct.productQuantity * this.roundToTwo(obj.productRate.standard)) : 0
        }
      })
    }
  }

  getProductById(productId: any) {
    let obj = this.productList.find((item: any) => item.productId == productId)
    return obj ? obj : {}
  }

  roundToTwo(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  getProductByType(productType: any) {
    return this.productList.filter((item: any) => item.productType == productType)
  }
}
