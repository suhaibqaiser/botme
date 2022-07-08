import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FormControl} from "@angular/forms";
import {SocketService} from "./socket.service";
import {HelperService} from "./helper.service";
import {ContextService} from "./context.service";
import {BotmeClientService} from "./botme-client.service";
import {MenuService} from "./menu.service";
import {ToastService} from "./toast.service";
import {Router} from "@angular/router";

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

  constructor(private _router: Router, private _toastService: ToastService, private _menuService: MenuService, private _clientService: BotmeClientService, private _contextService: ContextService, public _helperService: HelperService, private _socketService: SocketService) {
    if (!this._clientService.getCookie().isLoggedIn) {
      let list: any = localStorage.getItem('orderList')
      list = JSON.parse(list)
      this.cartProduct = list && list.length ? list : []
    }
  }


  addToCart(singleCustomProductObj: any, callType: any = '') {
    // when you are simply adding cart items in list
    if (callType === 'add_local_list' && !this._clientService.getCookie().isLoggedIn) {
      document.getElementById("ctaId-show-cart")?.click()
      this.cartProduct.push(JSON.parse(JSON.stringify(this.singleCustomProductObj)))
      localStorage.setItem('orderList', JSON.stringify(this.cartProduct))
      return
    }
    // when you are saving all cart items to db first time
    if (this._clientService.getCookie().isLoggedIn || callType === 'add_db') {
      this.addCartToDb(singleCustomProductObj, callType)
      return;
    }

    // if cart exists in db and we need to edit it
    if (singleCustomProductObj.cartId && singleCustomProductObj.cartId.length) {
      this.addCartToDb(singleCustomProductObj, 'edit_db')
      return;
    }

    if (callType === 'edit_local_list') {
      let cart = JSON.parse(JSON.stringify(this.singleCustomProductObj))
      let cartListIndex = this.cartProduct.findIndex((item: any) => item.productId == cart.productId)
      this.cartProduct.splice(cartListIndex, 1, cart)
      localStorage.setItem('orderList', JSON.stringify(this.cartProduct))
      document.getElementById("ctaId-show-cart")?.click()
      return;
    }
  }

  removeFromCart(product: any) {
    if (product.cartId && product.cartId.length) {
      this.cartLoader = true
      this._menuService.deleteCartById(product.cartId).subscribe((res: any) => {
        this._toastService.setToast({
          description: res.message,
          type: res.status
        })
        if (res.status === 'success') {
          this.cartProduct = []
          this._menuService.findOrderByOrderLabel(this._clientService.getCookie().orderLabel).subscribe((res: any) => {
            const cartList = res.payload.cart
            if (cartList && cartList.length) {
              cartList.forEach((cartItem: any) => {
                const product = this.products.find((item: any) => item.productId === cartItem.productId)
                this.cartProduct.push(JSON.parse(JSON.stringify(this._helperService.setSingleCustomizeProduct(product, cartItem))))
              })
            }
          })
          this.cartLoader = false
          if (this._helperService.getCurrentRouteName().split('/')[2] !== 'cart') {
            document.getElementById("ctaId-show-cart")?.click()
          }
        }
      })
      return
    }

    let cartListIndex = this.cartProduct.findIndex((item: any) => item.productId == product.productId)
    this.cartProduct.splice(cartListIndex, 1)
    localStorage.setItem('orderList', JSON.stringify(this.cartProduct))

  }

  getCartProducts(): Observable<any> {
    return this.cartProducts.asObservable();
  }

  //
  setProductCustomization(product: any) {

    if (!this._clientService.getCookie().isLoggedIn) {
      this._helperService.navigateTo('customer-signup')
      return
    }

    this._contextService.currentContextObj.pageId = 'pageId-product-customize-modal'
    this._contextService.currentContextObj.sectionId = 'sectionId-servingSize-productOptions'
    this.slideToShow = 0
    this._socketService.parentEntity = {
      entityId: product.productId,
      entityValue: product.productName
    }
    this.reset()
    this.singleCustomProductObj = this._helperService.setSingleCustomizeProduct(product)
    $('#pageId-productCustomizeModal').modal('show')
  }

  addCartToDb(singleCustomProductObj: any, callType: any = '') {
    // add product cart
    // this.cartLoader = true
    // if (!isEdit) {
    //   // const orderObj = this.orderObjGenerator(singleCustomProductObj)
    //   document.getElementById("ctaId-show-cart")?.click()
    //   // this._menuService.addToCartApi(orderObj).subscribe((res: any) => {
    //   //   this._toastService.setToast({
    //   //     description: res.message,
    //   //     type: res.status
    //   //   })
    //   //   this.cartLoader = false
    //   //   if (res.status === 'success') {
    //   //     this._clientService.setCookie('orderLabel', res.payload.order.orderLabel)
    //   //     this._clientService.setCookie('reservationLabel', res.payload.order.reservationLabel)
    //   //     this.singleCustomProductObj.cartId = res.payload.cart.cartId
    //   this.cartProduct.push(JSON.parse(JSON.stringify(this.singleCustomProductObj)))
    //   //   }
    //   // })
    //   return
    // }

    let updatedList: any = {
      order: {},
      cart: []
    }


    if (callType === 'edit_db') {
      this.cartLoader = true
      const orderObj = this.orderObjGenerator(singleCustomProductObj)
      if (this._helperService.getCurrentRouteName().split('/')[2] !== 'cart') {
        document.getElementById("ctaId-show-cart")?.click()
        document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:block')
      }
      this._menuService.editToCartApi(orderObj).subscribe((res: any) => {
        this._toastService.setToast({
          description: res.message,
          type: res.status
        })
        if (res.status === 'success') {
          this.cartProduct = []
          this._menuService.findOrderByOrderLabel(this._clientService.getCookie().orderLabel).subscribe((res: any) => {
            const cartList = res.payload.cart
            if (cartList && cartList.length) {
              cartList.forEach((cartItem: any) => {
                const product = this.products.find((item: any) => item.productId === cartItem.productId)
                this.cartProduct.push(JSON.parse(JSON.stringify(this._helperService.setSingleCustomizeProduct(product, cartItem))))
              })
            }
          })
          this.cartLoader = false
        }
      })
      return;
    }


    // when calling from cart section and updating order & its cart item status
    if (this._clientService.getCookie().isLoggedIn || callType === 'add_db') {

      if (!this.cartProduct && !this.cartProduct.length) {
        this._toastService.setToast({
          description: 'Sorry you have not added food items in cart yet.',
          type: 'error'
        })
        return;
      }


      this.cartLoader = true
      if (this._clientService.getCookie().isLoggedIn) {
        const orderObj = this.orderObjGenerator(singleCustomProductObj)
        updatedList.order = orderObj.order
        updatedList.cart.push(orderObj.cart)
        if (this._helperService.getCurrentRouteName().split('/')[2] !== 'cart') {
          document.getElementById("ctaId-show-cart")?.click()
        }
        this._menuService.addToCartApi(updatedList).subscribe((res: any) => {
          this._toastService.setToast({
            description: res.message,
            type: res.status
          })
          this.cartLoader = false
          if (res.status === 'success') {
            this._clientService.setCookie('orderStatus', res.payload.order.orderStatus)
            this._clientService.setCookie('orderLabel', res.payload.order.orderLabel)
            this.singleCustomProductObj.cartId = res.payload.cart[0].cartId
            this.cartProduct.push(JSON.parse(JSON.stringify(this.singleCustomProductObj)))
            console.log(this.cartProduct)
          }
        })
        return
      }


      let filterCartList = this._helperService.filterCartByCartId(JSON.parse(JSON.stringify(this.cartProduct)))
      filterCartList.forEach((item: any) => {
        let obj = this.orderObjGenerator(item)
        updatedList.order = obj.order
        updatedList.cart.push(obj.cart)
      })


      this._menuService.addToCartApi(updatedList).subscribe((res: any) => {
        this._toastService.setToast({
          description: res.message,
          type: res.status
        })
        this.cartLoader = false
        if (res.status === 'success') {
          this._clientService.setCookie('orderStatus', res.payload.order.orderStatus)
          this._clientService.setCookie('orderLabel', res.payload.order.orderLabel)
          let cartList = res.payload.cart
          cartList.forEach((item: any, index: any) => {
            this.cartProduct[index].cartId = (!item.cartId && item.productId === this.cartProduct[index].productId) ? item.cartId : ''
          })
          // this.singleCustomProductObj.cartId = res.payload.cart.cartId
          $('#order_type_modal').modal('hide')
          this._helperService.navigateTo('checkout')
        }
      })


      // this._menuService.updateOrderStatus(this._helperService.getOrderStatus('notified')).subscribe((res: any) => {
      //   this._toastService.setToast({
      //     description: res.message,
      //     type: res.status
      //   })
      //   this.cartLoader = false
      //   if (res.status === 'success') {
      //     this.cartProduct.forEach((item: any) => {
      //         item.status = true
      //       }
      //     )
      //     $('#order_type_modal').modal('hide')
      //     this._router.navigate(['/checkout'])
      //   }
      // })

      return;
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

  orderObjGenerator(singleCustomProductObj: any) {
    const modifiedObj = this.modifyCartObj(singleCustomProductObj)
    let cart: any = {}
    let order: any = {}


    cart = {
      restaurantId: this._helperService.getRestaurantIdOnAuthBasis(),
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

    order = {
      restaurantId: this._helperService.getRestaurantIdOnAuthBasis(),
      clientID: this._clientService.getCookie().clientID,
      orderLabel: (this._clientService.getCookie().orderLabel) ? this._clientService.getCookie().orderLabel : '',
      orderTimestamp: new Date(),
      orderType: this._helperService.getOrderTypeOnAuthBasis(),
      customerId: this._clientService.getCookie().customerId ? this._clientService.getCookie().customerId : '',
      addressId: '',
      tableId: '',
      delivery: {
        deliveryDate: '', // datetime
        deliverFee: '',
        deliveryNote: '',
      },
      orderPaymentMethod: '',
      orderSubTotal: singleCustomProductObj.productTotalPrice,
      orderTip: 0,
      orderDiscount: 0,
      orderServiceTax: 0,
      orderSalesTax: 0,
      orderTotal: singleCustomProductObj.productTotalPrice,
      orderStatus: this._helperService.getOrderStatus('notified')
    }
    return {
      cart: cart,
      order: order
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
    console.log(sizeObj, this.singleCustomProductObj.productServingSize)
    this.singleCustomProductObj.productServingSize.forEach((item: any) => {
      item.selected = item.serving_size_name.toLowerCase() === name.toLowerCase()
    })


    let obj = this.singleCustomProductObj.productServingSize.find((f: any) => f.selected == true)
    this.singleCustomProductObj.productPrice = this._helperService.roundToTwo(obj.serving_price)
    this._socketService.voiceServingSize = ''
    this.customizeBillCalculation()
  }

  customizeBillCalculation() {
    this.singleCustomProductObj.productTotalPrice = this._helperService.roundToTwo(this.singleCustomProductObj.productPrice * this.singleCustomProductObj.productQuantity)

    if (this.singleCustomProductObj.productToppings && this.singleCustomProductObj.productToppings.length) {
      this.singleCustomProductObj.productToppings.forEach((item: any) => {
        this.singleCustomProductObj.productTotalPrice += item.productTotalPrice
      })
    }

    if (this.singleCustomProductObj.productAddons && this.singleCustomProductObj.productAddons.length) {
      this.singleCustomProductObj.productAddons.forEach((item: any) => {
        this.singleCustomProductObj.productTotalPrice += item.productTotalPrice
      })
    }
    this.singleCustomProductObj.productTotalPrice = this._helperService.roundToTwo(this.singleCustomProductObj.productTotalPrice)
  }

  addToppingQuantity(toppings: any, type: any) {
    if (type === 'adding') {
      toppings.productQuantity = toppings.productQuantity + 1
    } else if (type === 'subtracting') {
      if (toppings.productQuantity === 0) return
      toppings.productQuantity = toppings.productQuantity - 1
    }
    toppings.productTotalPrice = toppings.productPrice * toppings.productQuantity
    toppings.productTotalPrice = this._helperService.roundToTwo(toppings.productTotalPrice)
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
    addons.productTotalPrice = this._helperService.roundToTwo(addons.productTotalPrice)
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
    product.productTotalPrice = this._helperService.roundToTwo(product.productTotalPrice)
  }

  getTotalPrice(obj: any) {
    let total = 0
    obj.forEach((item: any) => {
      if (item.productQuantity) {
        total += item.productTotalPrice
      }
    })
    return this._helperService.roundToTwo(total)
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
    if (type && type.length && !!objectList) {
      selectedList = objectList.filter((item: any) => item.productQuantity)
      return selectedList.length
    }
    return (!!objectList) ? objectList.filter((item: any) => item.selected).length : 0
  }

  checkCommasWithAttribute(objectList: any, optIndex: any) {
    const selectedList = (!!objectList) ? objectList.filter((item: any) => item.productQuantity).length : 0
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
    if (this.slideToShow === 3 && !this.singleCustomProductObj.productIngredients && !this.singleCustomProductObj.productFlavors) {
      this.slideToShow = 0
    } else if (this.slideToShow === 2 && !this.singleCustomProductObj.productToppings) {
      this.slideToShow--
    }
    this.setCurrentContext()
  }

  nextSlide() {
    this.slideToShow++
    if (this.slideToShow === 1 && !this.singleCustomProductObj.productIngredients && !this.singleCustomProductObj.productFlavors) {
      this.slideToShow = 4
    } else if (this.slideToShow === 2 && !this.singleCustomProductObj.productToppings) {
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

  getSubTotal() {
    let total = 0
    if (this.cartProduct && this.cartProduct.length) {
      this.cartProduct.forEach((item: any) => {
        total += item.productTotalPrice
      })
    }
    return this._helperService.roundToTwo(total)
  }

}
