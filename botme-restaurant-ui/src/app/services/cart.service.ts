import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FormControl} from "@angular/forms";
import {SocketService} from "./socket.service";
import {HelperService} from "./helper.service";
import {ContextService} from "./context.service";
import {BotmeClientService} from "./botme-client.service";
import {MenuService} from "./menu.service";

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

  selectProductRatesField = new FormControl('')

  constructor(private _menuService: MenuService, private _clientService: BotmeClientService, private _contextService: ContextService, public _helperService: HelperService, private _socketService: SocketService) {
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
      this.addCartToDb(singleCustomProductObj, isEdit, type)
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
      productTotalPrice: this.roundToTwo(productServingSizeList[0].serving_price)
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
        const selectedProduct = productToppings.find((product: any) => product.productId === obj.productId)
        return {
          productId: obj.productId,
          productName: obj.productName,
          productImage: this._helperService.resolveProductImage(obj),
          selected: (productToppingsIdList) ? productToppingsIdList.includes(obj.productId) : false,
          productQuantity: (selectedProduct && selectedProduct.productQuantity) ? selectedProduct.productQuantity : 0,
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
    if (!isEdit) {
      let obj = {
        cart: {
          restaurantId: this._clientService.getCookie().restaurantId,
          cartId: '',
          cartProduct: {
            productId: singleCustomProductObj.productId,
            productSerialNo: '',
            productCategory: '',
            productFlavor: this.modifyCartObj(singleCustomProductObj).productFlavor,
            productProportion: this.modifyCartObj(singleCustomProductObj).productProportion,
            productToppings: this.modifyCartObj(singleCustomProductObj).productToppings,
            productOptions: this.modifyCartObj(singleCustomProductObj).productOptions,
            productRate: this.modifyCartObj(singleCustomProductObj).productRate,
            productQuantity: singleCustomProductObj.productQuantity,
            productNotes: '', // customization Instructions
            status: singleCustomProductObj.status, // pending, in-progress
          },
          cartDiscount: 0,
          cartTotal: singleCustomProductObj.productTotalPrice,
        }
      }
      console.log('obj +.', obj)
      this._menuService.addToCartApi(obj).subscribe((res: any) => {
        if (res.status === 'success') {
          const product = this.getProductById(res.payload.cartProduct[0].productId)
          console.log(product, res.payload.cartProduct[0])
          console.log(this.setSingleCustomizeProduct(product, res.payload.cartProduct[0]))
        }
      })
    }
  }

  modifyCartObj(singleCustomProductObj: any) {
    let {productFlavors, productAddons, productToppings, productOptions, productServingSize} = singleCustomProductObj
    let modifiedProductFlavor: any = ''
    let modifiedProductProportion: any = []
    let modifiedProductTopping: any = []
    let modifiedProductOptions: any = []
    let modifiedProductRate: any = {}

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
      productRate: modifiedProductRate
    }
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
