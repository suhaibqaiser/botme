import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FormControl} from "@angular/forms";
import {SocketService} from "./socket.service";
import {HelperService} from "./helper.service";
import {ContextService} from "./context.service";

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartProducts = new Subject();

  cartProduct: string[] = []


  products: any
  slideToShow: any = 0
  singleCustomProductObj: any = {
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
  productSizeList: any = []
  tempProductSizeList = [
    {
      serving_size_name: 'standard',
      selected: true,
      serving_price: 0
    },
    {
      serving_size_name: 'medium',
      selected: false,
      serving_price: 0
    },
    {
      serving_size_name: 'large',
      selected: false,
      serving_price: 0
    },
    {
      serving_size_name: 'small',
      selected: false,
      serving_price: 0
    }
  ]
  selectProductRatesField = new FormControl('')

  constructor(private _contextService: ContextService, public _helperService: HelperService, private _socketService: SocketService) {
    this.getFromLocalstorage();
  }

  getFromLocalstorage() {
    let _cartProducts = localStorage.getItem('cart-products');
    (_cartProducts) ? this.cartProduct = JSON.parse(_cartProducts) : null;
    this.cartProducts.next(JSON.stringify(this.cartProduct));
  }

  setToLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    this.cartProducts.next(JSON.stringify(this.cartProduct));
  }

  addToCart(singleCustomProductObj: any, isEdit: any = false, type: any = '') {
    if (!isEdit) {
      this.cartProduct.push(singleCustomProductObj)
    } else if (isEdit && type == 'place-order') {
      this.cartProduct = singleCustomProductObj
    } else if (isEdit) {
      this.cartProduct.splice(this.cartProduct.indexOf(singleCustomProductObj.productId), 1)
      this.cartProduct.push(singleCustomProductObj)
    }

    this.setToLocalStorage("cart-products", this.cartProduct);
  }

  removeFromCart(productId: string) {
    this.cartProduct.forEach((item: any, index) => {
      if (item.productId == productId) {
        this.cartProduct.splice(index, 1);
      }
    })
    // this.cartProduct.splice(this.cartProduct.indexOf(productId), 1);
    this.setToLocalStorage("cart-products", this.cartProduct);
  }

  getCartProducts(): Observable<any> {
    this.getFromLocalstorage();
    return this.cartProducts.asObservable();
  }

  //////////////// cart customization //////////////////////
  setProductRateSize(product: any) {
    this.productSizeList = []
    let keysList = Object.keys(product.productRate)
    keysList.forEach((item: any, index) => {
      this.productSizeList.push({
        serving_size_name: item,
        selected: index == 0,
        serving_price: product.productRate[item]
      })
    })
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
    let productOptionsList: any = []
    let productIngredientList: any = []
    let productFlavoursList: any = []
    let productAddonsList: any = []
    let productToppingsList: any = []
    let productServingSizeList: any = []


    let DB = {
      restaurantId: '',
      cartId: '',
      cartProduct: [{
        productId: '',
        productSerialNo: '',
        productCategory: '',
        productFlavor: '',
        productProportion: [{
          productId: '',
          productQuantity: 0
        }],
        productToppings: [{
          productId: '',
          productQuantity: 0
        }],
        productOptions: [{
          productId: '',
          productQuantity: 0
        }],
        productRate: {
          standard: 0,
          small: 0,
          medium: 0,
          large: 0
        },
        productQuantity: 0,
        productNotes: '', // customization Instructions
      }],
      cartDiscount: 0,
      cartTotal: 0,
    }

    productServingSizeList = this.getSelectedServingSize(product.productRate, {})

    this.singleCustomProductObj = {
      productName: product.productName,
      productId: product.productId,
      productImage: product.productImage,
      productRate: product.productRate,
      productServingSize: productServingSizeList,
      productOptions: this.getSelectedProductOptions(product.productOptions, []),
      productIngredients: this.getSelectedProductIngredient(product.productIngredients, []),
      productFlavors: this.getSelectedProductFlavor(product.productFlavor, ''),
      productAddons: this.getSelectedProductProportion([]),
      productToppings: this.getSelectedProductToppings(product.productToppings, []),
      productQuantity: 1,
      status: false,
      productAttributes: product.productAttributes,
      productNutrition: product.productNutrition,
      productPrice: this.roundToTwo(productServingSizeList[0].serving_price),
      productTotalPrice: this.roundToTwo(productServingSizeList[0].serving_price)
    }
    $('#pageId-productCustomizeModal').modal('show')
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
    console.log(productFlavorList)
    if (productFlavorList && productFlavorList.length) {
      return productFlavorList.map((item: any) => {
        return {
          flavorName: item,
          selected: (productFlavorName) ? (item === productFlavorName) : false
        }
      })
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
    if (productList && productList.length) {
      return productList.map((item: any) => {
        return {
          productId: item.productId,
          productName: item.productName,
          productImage: this._helperService.resolveProductImage(item),
          selected: (productProportionIdList) ? productProportionIdList.includes(item.productId) : false,
          productQuantity: (productProportion && productProportion.length) ? productProportion.find((product: any) => product.productId === item.productId).productQuantity : 0,
          productPrice: this.roundToTwo(item.productRate.standard),
          productTotalPrice: 0
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
        return {
          productId: obj.productId,
          productName: obj.productName,
          productImage: this._helperService.resolveProductImage(obj),
          selected: (productToppingsIdList) ? productToppingsIdList.includes(obj.productId) : false,
          productQuantity: (productToppings && productToppings.length) ? productToppings.find((product: any) => product.productId === obj.productId).productQuantity : 0,
          productPrice: this.roundToTwo(obj.productRate.standard),
          productTotalPrice: 0
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
            selected: (productOptions && productOptions.length) ? productOptions.includes(obj.productId) : false,
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
          selected: (productIngredient) ? productIngredient.includes(obj.productId) : true,
        }
      })
    }
  }

  /**
   * get user selected select serving size
   * @param productRateList
   */
  getSelectedServingSize(productRateList: any = [], productRate: any = {}) {
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
    this.setCurrentContext()
    if (this.slideToShow === 3 && !this.singleCustomProductObj.productIngredients.length && !this.singleCustomProductObj.productFlavors.length) {
      this.slideToShow = 0
    } else if (this.slideToShow === 2 && !this.singleCustomProductObj.productToppings.length) {
      this.slideToShow--
    }
  }

  nextSlide() {
    this.slideToShow++
    this.setCurrentContext()
    if (this.slideToShow === 1 && !this.singleCustomProductObj.productIngredients.length && !this.singleCustomProductObj.productFlavors.length) {
      this.slideToShow = 4
    } else if (this.slideToShow === 2 && !this.singleCustomProductObj.productToppings.length) {
      this.slideToShow++
    }
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
