import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FormControl} from "@angular/forms";
import {SocketService} from "./socket.service";
import {HelperService} from "./helper.service";
import {ContextService} from "./context.service";
import {BotmeClientService} from "./botme-client.service";
import {MenuService} from "./menu.service";
import {ToastService} from "./toast.service";

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartProducts = new Subject();
  cartProduct: any = []

  products: any
  slideToShow: any = 0
  singleCustomProductObj: any = {
    _id: '',
    restaurantId: '',
    orderLabel: '',
    cartId: '',
    productName: '',
    productId: '',
    productImage: '',
    productRate: 0,
    productServingSize: [],
    productOptions: [],
    productIngredients: [],
    productFlavors: [],
    productAddons: [],
    productToppings: [],
    productQuantity: 1,
    status: false,
    productAttributes: {},
    productNutrition: {},
    productPrice: 0,
    productTotalPrice: 0,
    cartDiscount: 0,
    cartTotal: 0
  }

  selectProductRatesField = new FormControl('')

  cartLoader: boolean = false

  constructor(private _toastService: ToastService, private _menuService: MenuService, private _clientService: BotmeClientService, private _contextService: ContextService, public _helperService: HelperService, private _socketService: SocketService) {
  }


  addToCart(singleCustomProductObj: any, isEdit: any = false, type: any = '') {
    if (!isEdit) {
      this.addCartToDb(singleCustomProductObj, isEdit, type)
    } else if (isEdit && type == 'place-order') {

    } else if (isEdit) {
      this.addCartToDb(singleCustomProductObj, isEdit, type)
    }
  }

  removeFromCart(product: any) {
    console.log(product)
    this.cartLoader = true
    this._menuService.deleteCartById(product.cartId).subscribe((res: any) => {
      this._toastService.setToast({
        description: res.message,
        type: res.status
      })
      if (res.status === 'success') {
        this.cartLoader = false
        let cartListIndex = this.cartProduct.findIndex((item: any) => item._id === this.singleCustomProductObj._id)
        this.cartProduct.splice(cartListIndex, 1)

        if (this._helperService.getCurrentRouteName() !== '/cart') {
          document.getElementById("ctaId-show-cart")?.click()
        }
      }
    })

  }

  getCartProducts(): Observable<any> {
    return this.cartProducts.asObservable();
  }

  //
  setProductCustomization(product: any) {
    this._contextService.currentContextObj.pageId = 'pageId-product-customize-modal'
    this._contextService.currentContextObj.sectionId = 'sectionId-servingSize-productOptions'
    this.slideToShow = 0
    this._socketService.parentEntity = {
      entityId: product.productId,
      entityValue: product.productName
    }
    this.reset()
    this.singleCustomProductObj = this.setSingleCustomizeProduct(product)
    $('#pageId-productCustomizeModal').modal('show')
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
      status: false,
      productAttributes: product.productAttributes,
      productNutrition: product.productNutrition,
      productPrice: this.roundToTwo(productServingSizeList[0].serving_price),
      productTotalPrice: (cartProduct.productTotalPrice) ? cartProduct.productTotalPrice : this.roundToTwo(productServingSizeList[0].serving_price),
      cartDiscount: cartProduct.cartDiscount,
      cartTotal: cartProduct.cartTotal
    }
  }

  getProductById(productId: any) {
    let obj = this.products.find((item: any) => item.productId == productId)
    return obj ? obj : {}
  }

  getProductByType(productType: any) {
    return this.products.filter((item: any) => item.productType == productType)
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
          productImage: this._helperService.resolveProductImage(item),
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
          productImage: this._helperService.resolveProductImage(obj),
          selected: (productToppingsIdList) ? productToppingsIdList.includes(obj.productId) : false,
          productQuantity: (selectedProduct && selectedProduct.productQuantity) ? selectedProduct.productQuantity : 0,
          productPrice: this.roundToTwo(obj.productRate.standard),
          productTotalPrice: (selectedProduct && selectedProduct.productQuantity) ? (selectedProduct.productQuantity * this.roundToTwo(obj.productRate.standard)) : 0
        }
      })
    }
  }

  /**
   * get the user selected product options
   * @param productOptionsList
   * @param productOptions
   */
  getSelectedProductOptions(productOptionsList: any = [], productOptions: any = []) {
    let productOptionList = productOptionsList.reduce((prev: any, next: any) => {
      return [...prev, ...next]
    })
    if (productOptionList && productOptionList.length) {
      return productOptionList.map((item: any) => {
          let obj = this.getProductById(item)
          return {
            productId: obj.productId,
            productName: obj.productName,
            productImage: this._helperService.resolveProductImage(obj),
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
    if (productIngredientList && productIngredientList.length) {
      return productIngredientList.map((item: any) => {
        let obj = this.getProductById(item)
        return {
          productId: obj.productId,
          productName: obj.productName,
          productImage: this._helperService.resolveProductImage(obj),
          selected: (productIngredient && productIngredient.length) ? !!productIngredient.find((dbItem: any) => obj.productId === dbItem.productId) : true,
        }
      })
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

  addCartToDb(singleCustomProductObj: any, isEdit: any = false, type: any = '') {
    // add product cart
    this.cartLoader = true
    if (!isEdit) {
      const orderObj = this.orderObjGenerator(singleCustomProductObj)
      document.getElementById("ctaId-show-cart")?.click()
      this._menuService.addToCartApi(orderObj).subscribe((res: any) => {
        this._toastService.setToast({
          description: res.message,
          type: res.status
        })
        if (res.status === 'success') {
          this._clientService.setCookie('orderLabel', res.payload.order.orderLabel)
          this._clientService.setCookie('reservationLabel', res.payload.order.orderLabel)
          this.cartLoader = false
          this.singleCustomProductObj.cartId = res.payload.cart.cartId
          this.cartProduct.push(JSON.parse(JSON.stringify(this.singleCustomProductObj)))
        }
      })
    }

    if (isEdit) {
      const orderObj = this.orderObjGenerator(singleCustomProductObj, true)

      if (this._helperService.getCurrentRouteName() !== '/cart') {
        document.getElementById("ctaId-show-cart")?.click()
        document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:block')
      }
      this._menuService.editToCartApi(orderObj).subscribe((res: any) => {
        this._toastService.setToast({
          description: res.message,
          type: res.status
        })
        if (res.status === 'success') {
          this.cartLoader = false
          let cart = JSON.parse(JSON.stringify(this.singleCustomProductObj))

          let cartListIndex = this.cartProduct.findIndex((item: any) => item._id === cart._id)
          this.cartProduct.splice(cartListIndex, 1, cart)
        }
      })
    }
  }

  /**
   * this will set or reset the cart items
   * @param singleCustomProductObj
   */
  modifyCartObj(singleCustomProductObj: any) {
    let {
      productIngredients,
      productFlavors,
      productAddons,
      productToppings,
      productOptions,
      productServingSize
    } = singleCustomProductObj
    let modifiedProductFlavor: any = ''
    let modifiedProductProportion: any = []
    let modifiedProductTopping: any = []
    let modifiedProductOptions: any = []
    let modifiedProductRate: any = {}
    let modifiedProductIngredients: any = []

    // productIngriedients modified
    if (productIngredients && productIngredients.length) {
      modifiedProductIngredients = productIngredients.filter((item: any) => item.selected == true)
      console.log('modifiedProductIngredients =>', modifiedProductIngredients)
      modifiedProductIngredients = modifiedProductIngredients.map((item: any) => {
          return {
            productId: item.productId,
            productQuantity: 0
          }
        }
      )
    }

    // product flavor modified
    if (productFlavors && productFlavors.length) {
      modifiedProductFlavor = productFlavors.find((item: any) => item.selected === true)
      console.log('modifiedProductFlavor =>', modifiedProductFlavor)
      modifiedProductFlavor = (modifiedProductFlavor && modifiedProductFlavor.flavorName) ? modifiedProductFlavor.flavorName : ''
    }

    // product proportion modified
    if (productAddons && productAddons.length) {
      modifiedProductProportion = productAddons.filter((item: any) => item.productQuantity > 0)
      console.log('modifiedProductProportion =>', modifiedProductProportion)
      modifiedProductProportion = modifiedProductProportion.map((item: any) => {
        return {
          productId: item.productId,
          productQuantity: item.productQuantity
        }
      })
    }

    // product Topping modified
    if (productToppings && productToppings.length) {
      modifiedProductTopping = productToppings.filter((item: any) => item.productQuantity > 0)
      console.log('modifiedProductTopping =>', modifiedProductTopping)
      modifiedProductTopping = modifiedProductTopping.map((item: any) => {
        return {
          productId: item.productId,
          productQuantity: item.productQuantity
        }
      })
    }

    // productOptions modified
    if (productOptions && productOptions.length) {
      modifiedProductOptions = productOptions.filter((item: any) => item.selected === true)
      console.log('modifiedProductOptions =>', modifiedProductOptions)
      modifiedProductOptions = modifiedProductOptions.map((item: any) => {
          return {
            productId: item.productId,
            productQuantity: 0
          }
        }
      )
    }

    // productRate modified
    if (productServingSize && productServingSize.length) {
      const obj = productServingSize.find((item: any) => item.selected === true)
      console.log('modifiedProductRate =>', obj)
      modifiedProductRate[obj.serving_size_name] = obj.serving_price
    }

    return {
      productFlavor: modifiedProductFlavor,
      productProportion: modifiedProductProportion,
      productToppings: modifiedProductTopping,
      productOptions: modifiedProductOptions,
      productRate: modifiedProductRate,
      productIngredients: modifiedProductIngredients
    }
  }

  orderObjGenerator(singleCustomProductObj: any, isEdit = false) {
    const modifiedObj = this.modifyCartObj(singleCustomProductObj)
    const order = {
      restaurantId: this._clientService.getCookie().restaurantId,
      orderLabel: (this._clientService.getCookie().orderLabel) ? this._clientService.getCookie().orderLabel : '',
      reservationLabel: this._clientService.getCookie().reservationLabel,
      orderTimestamp: new Date(),
      orderType: this._clientService.getCookie().orderType,
      customerId: this._clientService.getCookie().clientID ? this._clientService.getCookie().clientID : '',
      addressId: '',
      tableId: '',
      orderPaymentMethod: '',
      orderSubTotal: singleCustomProductObj.productTotalPrice,
      orderTip: 0,
      orderDiscount: 0,
      orderServiceTax: 0,
      orderSalesTax: 0,
      orderTotal: singleCustomProductObj.productTotalPrice,
      orderStatus: false
    }
    const cart = {
      restaurantId: this._clientService.getCookie().restaurantId,
      cartId: singleCustomProductObj.cartId ? singleCustomProductObj.cartId : '',
      orderLabel: (this._clientService.getCookie().orderLabel) ? this._clientService.getCookie().orderLabel : '',
      productId: singleCustomProductObj.productId,
      productSerialNo: '',
      productCategory: '',
      productFlavor: modifiedObj.productFlavor,
      productProportion: modifiedObj.productProportion,
      productToppings: modifiedObj.productToppings,
      productOptions: modifiedObj.productOptions,
      productRate: modifiedObj.productRate,
      productQuantity: singleCustomProductObj.productQuantity,
      productIngredients: modifiedObj.productIngredients,
      productNotes: '', // customization Instructions
      status: singleCustomProductObj.status, // pending, in-progress
      productTotalPrice: singleCustomProductObj.productTotalPrice,
      cartDiscount: 0,
      cartTotal: singleCustomProductObj.productTotalPrice,
    }
    if (isEdit) {
      return {
        cart: cart
      }
    }

    if (!isEdit) {
      return {
        cart: cart,
        order: order
      }
    }
    return {}
  }

  selectFlavor(flavor: any) {
    this.singleCustomProductObj.productFlavors.forEach((item: any) => {
      item.selected = item.flavorName === flavor.flavorName
    })
  }

  selectIngredients(ingredient: any) {
    ingredient.selected = !ingredient.selected
  }

  selectProductOptions(option: any) {
    option.selected = !option.selected
  }

  selectServing(sizeObj: any) {
    let name = (this._socketService.voiceServingSize && this._socketService.voiceServingSize.length) ? this._socketService.voiceServingSize : sizeObj.serving_size_name
    this.singleCustomProductObj.productServingSize.forEach((item: any) => {
      item.selected = item.serving_size_name.toLowerCase() === name.toLowerCase()
    })


    let obj = this.singleCustomProductObj.productServingSize.find((f: any) => f.selected == true)
    this.singleCustomProductObj.productPrice = this.roundToTwo(obj.serving_price)
    this._socketService.voiceServingSize = ''
    this.customizeBillCalculation()
  }

  customizeBillCalculation() {
    this.singleCustomProductObj.productTotalPrice = this.roundToTwo(this.singleCustomProductObj.productPrice * this.singleCustomProductObj.productQuantity)
    console.log(this.singleCustomProductObj.productTotalPrice)
    this.singleCustomProductObj.productToppings.forEach((item: any) => {
      this.singleCustomProductObj.productTotalPrice += item.productTotalPrice
    })

    this.singleCustomProductObj.productAddons.forEach((item: any) => {
      this.singleCustomProductObj.productTotalPrice += item.productTotalPrice
    })
    this.singleCustomProductObj.productTotalPrice = this.roundToTwo(this.singleCustomProductObj.productTotalPrice)
  }

  addToppingQuantity(toppings: any, type: any) {
    if (type === 'adding') {
      toppings.productQuantity = toppings.productQuantity + 1
    } else if (type === 'subtracting') {
      if (toppings.productQuantity === 0) return
      toppings.productQuantity = toppings.productQuantity - 1
    }
    toppings.productTotalPrice = toppings.productPrice * toppings.productQuantity
    toppings.productTotalPrice = this.roundToTwo(toppings.productTotalPrice)
    this.customizeBillCalculation()
  }

  addAddonQuantity(addons: any, type: any) {
    if (type === 'adding') {
      addons.productQuantity = addons.productQuantity + 1
    } else if (type === 'subtracting') {
      if (addons.productQuantity === 0) return
      addons.productQuantity = addons.productQuantity - 1
    }
    addons.productTotalPrice = addons.productPrice * addons.productQuantity
    addons.productTotalPrice = this.roundToTwo(addons.productTotalPrice)
    this.customizeBillCalculation()
  }

  addProductQuantity(product: any, type: any) {
    this.customizeBillCalculation()
    if (type === 'adding') {
      product.productQuantity = product.productQuantity + 1
    } else if (type === 'subtracting') {
      if (product.productQuantity === 1) return
      product.productQuantity = product.productQuantity - 1
    }
    product.productTotalPrice = product.productTotalPrice * product.productQuantity
    product.productTotalPrice = this.roundToTwo(product.productTotalPrice)
  }

  getTotalPrice(obj: any) {
    let total = 0
    obj.forEach((item: any) => {
      if (item.productQuantity) {
        total += item.productTotalPrice
      }
    })
    return this.roundToTwo(total)
  }

  checkCommas(objectList: any) {
    const selectedList = objectList.filter((item: any) => item.selected)
    let selectedProductNames = ''
    selectedList.forEach((item: any, index: any) => {
      if (index == 0) {
        selectedProductNames += item.productName
      } else {
        selectedProductNames += ' , ' + item.productName
      }
    })
    return selectedProductNames
  }

  checkCommasWithQuantity(objectList: any) {
    const selectedList = objectList.filter((item: any) => item.productQuantity)
    let selectedProductNames = ''
    selectedList.forEach((item: any, index: any) => {
      if (index == 0) {
        selectedProductNames += item.productName
      } else {
        selectedProductNames += ' , ' + item.productName
      }
    })
    return selectedProductNames
  }


  isSelected(objectList: any, type: any = '') {
    let selectedList = []
    if (type && type.length) {
      selectedList = objectList.filter((item: any) => item.productQuantity)
      return selectedList.length
    }
    selectedList = objectList.filter((item: any) => item.selected)
    return selectedList.length
  }

  checkCommasWithAttribute(objectList: any, optIndex: any) {
    const selectedList = objectList.filter((item: any) => item.productQuantity)
    return optIndex + 1 < selectedList.length
  }

  reset() {
    this.singleCustomProductObj = {
      productName: '',
      productId: '',
      productImage: '',
      productRate: {},
      productServingSize: '',
      productOptions: [],
      productIngredients: [],
      productFlavors: [],
      productAddons: [],
      productToppings: [],
      productAttributes: {},
      productNutrition: {},
      productQuantity: 1,
      productPrice: 0,
      productTotalPrice: 0,
      isEditable: false,
      isShowInfo: false,
      status: false
    }
  }

  previousSlide() {
    this.slideToShow--
    if (this.slideToShow === 3 && !this.singleCustomProductObj.productIngredients.length && !this.singleCustomProductObj.productFlavors.length) {
      this.slideToShow = 0
    } else if (this.slideToShow === 2 && !this.singleCustomProductObj.productToppings.length) {
      this.slideToShow--
    }
    this.setCurrentContext()
  }

  nextSlide() {
    this.slideToShow++
    if (this.slideToShow === 1 && !this.singleCustomProductObj.productIngredients.length && !this.singleCustomProductObj.productFlavors.length) {
      this.slideToShow = 4
    } else if (this.slideToShow === 2 && !this.singleCustomProductObj.productToppings.length) {
      this.slideToShow++
    }
    this.setCurrentContext()
  }

  setCurrentContext() {
    if (this.slideToShow == 0) this._contextService.currentContextObj.sectionId = 'sectionId-servingSize-productOptions'
    if (this.slideToShow == 1) this._contextService.currentContextObj.sectionId = 'sectionId-ingredients-flavour'
    if (this.slideToShow == 2) this._contextService.currentContextObj.sectionId = 'sectionId-toppings'
    if (this.slideToShow == 3) this._contextService.currentContextObj.sectionId = 'sectionId-addons'
    if (this.slideToShow == 4) this._contextService.currentContextObj.sectionId = 'sectionId-summary'
  }

  roundToTwo(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}
