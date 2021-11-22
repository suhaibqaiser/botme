import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FormControl} from "@angular/forms";
import {SocketService} from "./socket.service";

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
    productServingSize: {},
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
  tempProductSizeList = ['standard', 'medium', 'large', 'small']
  productSizeArrayList = [
    {
      sizeId: '3ab61ecf-61f8-4608-b4a0-2a66e85c299a',
      name: 'standard',
      selected: false
    },
    {
      sizeId: '987f4971-8fea-45c0-99ba-97eb5b96b241',
      name: 'medium',
      selected: false
    },
    {
      sizeId: '10286d1a-e0b8-4f22-911a-8f407b4d034a',
      name: 'large',
      selected: false
    },
    {
      sizeId: '318c21cc-dad7-41ad-838d-1f82d7ff6071',
      name: 'small',
      selected: false
    }
  ]
  selectProductRatesField = new FormControl('')

  constructor(private _socketService: SocketService) {
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
    let i = 0
    this.productSizeArrayList.forEach((item: any, index: any) => {
      if (product.productRate[item.name] > 0) {
        this.productSizeList.push(item)
      }
    })
  }

  //
  setProductCustomization(product: any) {
    this._socketService.currentContextObj.pageId = 'pageId-product-customize-modal'
    this._socketService.currentContextObj.sectionId = 'sectionId-servingSize-productOptions'
    this.slideToShow = 0
    this.reset()
    this.setProductRateSize(product)
    let productOptionsList: any = []
    let productIngredientList: any = []
    let productFlavoursList: any = []
    let productAddonsList: any = []
    let productToppingsList: any = []
    if (product.productOptions && product.productOptions.length) {
      product.productOptions.forEach((array: any) => {
        array.forEach((item: any, i: any) => {
          let obj = this.getProductById(item)
          if (obj) {
            productOptionsList.push({
              productId: obj.productId,
              productName: obj.productName,
              productImage: this.resolveImages(obj),
              selected: false
            })
          }
        })
      })
    }

    if (product.productIngredients && product.productIngredients.length) {
      product.productIngredients.forEach((item: any, index: any) => {
        let obj = this.getProductById(item)
        if (obj) {
          productIngredientList.push({
            productId: obj.productId,
            productName: obj.productName,
            productImage: this.resolveImages(obj),
            selected: true
          })
        }
      })
    }

    if (product.productToppings && product.productToppings.length) {
      product.productToppings.forEach((item: any, index: any) => {
        let obj = this.getProductById(item)
        if (obj) {
          productToppingsList.push({
            productId: obj.productId,
            productName: obj.productName,
            productImage: this.resolveImages(obj),
            productQuantity: 0,
            productPrice: this.roundToTwo(obj.productRate.standard),
            productTotalPrice: 0
          })
        }
      })
    }

    if (product.productFlavor && product.productFlavor.length) {
      product.productFlavor.forEach((item: any, index: any) => {
        productFlavoursList.push({
          flavorName: item,
          selected: (index == 0)
        })
      })
    }
    let productlist = this.getProductByType('Addon')
    if (productlist && productlist.length) {
      productlist.forEach((item: any) => {
        productAddonsList.push({
          productId: item.productId,
          productName: item.productName,
          productImage: this.resolveImages(item),
          selected: false,
          productQuantity: 0,
          productPrice: this.roundToTwo(item.productRate.standard),
          productTotalPrice: 0
        })
      })
    }

    this.singleCustomProductObj = {
      productName: product.productName,
      productId: product.productId,
      productImage: product.productImage,
      productRate: product.productRate,
      productServingSize: this.productSizeList[0],
      productOptions: productOptionsList,
      productIngredients: productIngredientList,
      productFlavors: productFlavoursList,
      productAddons: productAddonsList,
      productToppings: productToppingsList,
      productQuantity: 1,
      status: false,
      productAttributes: product.productAttributes,
      productNutrition: product.productNutrition,
      productPrice: this.roundToTwo(product.productRate[this.productSizeList[0].name]),
      productTotalPrice: this.roundToTwo(product.productRate[this.productSizeList[0].name])
    }
    // this.selectProductRatesField.setValue(this.productSizeList[0])
    $('#pageId-productCustomizeModal').modal('show')
  }

  resolveImages(product: any) {
    if (product.productImage && product.productImage.length) {
      return 'assets/images/products/' + product.productImage[0]
    }
    return 'assets/images/product-1.png'
  }

  getProductById(productId: any) {
    return this.products.find((item: any) => item.productId == productId)
  }

  getProductByType(productType: any) {
    return this.products.filter((item: any) => item.productType == productType)
  }

  selectProductRate(sizeObj: any) {
    if (this._socketService.voiceServingSize) {
      this.productSizeList.forEach((item: any) => {
        if(item==this._socketService.voiceServingSize){
          this.singleCustomProductObj.productServingSize = item
        }
      })
    }
    if (sizeObj.name && sizeObj.name.length) this.singleCustomProductObj.productServingSize = sizeObj.name
    this.singleCustomProductObj.productPrice = this.roundToTwo(this.singleCustomProductObj.productRate[this.singleCustomProductObj.productServingSize])
    this.productSizeList.forEach((item: any) => {
      item.selected = item.name === this.singleCustomProductObj.productServingSize
    })
    this.customizeBillCalculation()
    this._socketService.voiceServingSize = ''
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

  customizeBillCalculation() {
    this.singleCustomProductObj.productTotalPrice = this.singleCustomProductObj.productPrice
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
    if (this.slideToShow == 0) this._socketService.currentContextObj.sectionId = 'sectionId-servingSize-productOptions'
    if (this.slideToShow == 1) this._socketService.currentContextObj.sectionId = 'sectionId-ingredients-flavour'
    if (this.slideToShow == 2) this._socketService.currentContextObj.sectionId = 'sectionId-toppings'
    if (this.slideToShow == 3) this._socketService.currentContextObj.sectionId = 'sectionId-addons'
    if (this.slideToShow == 4) this._socketService.currentContextObj.sectionId = 'sectionId-summary'
  }

  selectServingSize(sizeObj: any) {

  }

  roundToTwo(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}
