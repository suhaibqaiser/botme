import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {MenuService} from 'src/app/services/menu.service';

declare var $: any;

@Component({
  selector: 'app-cart-section',
  templateUrl: './cart-section.component.html',
  styleUrls: ['./cart-section.component.scss']
})
export class CartSectionComponent implements OnInit {
  productIds: string[] = []
  products: any[] = []
  cartProducts: any[] = []
  cartTotal = 0

  constructor(private cartService: CartService,
              private MenuService: MenuService) {
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCartProducts();
  }

  getCartProducts() {
    this.cartService.getCartProducts().subscribe(
      res => {
        // this.productIds = JSON.parse(res)
        this.cartProducts = JSON.parse(res)
        this.cartTotal = 0
        // for (let id in this.productIds) {
        //   this.cartProducts.push(this.products.find((product: { productId: string }) => product.productId === this.productIds[id]));
        //   this.cartTotal += this.cartProducts[id].productRate.standard
        // }
      }
    )
  }

  getProducts(): void {
    this.MenuService.getProducts()
      .subscribe(result => {
        this.products = result.payload
        this.getCartProducts();
      });
  }

  calculateTotalPrice(productToppings: any) {
    let price = 0
    if (productToppings && productToppings.length) {
      productToppings.forEach((item: any) => {
        price += item.productTotalPrice
      })
    }
    return price
  }

  totalCartPrice() {
    let price = 0
    if (this.cartProducts && this.cartProducts.length) {
      this.cartProducts.forEach((item: any) => {
        price += item.productTotalPrice
      })
    }
    return price
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  resolveImages(product: any) {
    if (product.productImage && product.productImage.length) {
      return 'assets/images/products/' + product.productImage[0]
    }
    return 'assets/images/product-1.png'
  }

  customizeBillCalculation(product: any) {
    product.productTotalPrice = product.productPrice
    product.productToppings.forEach((item: any) => {
      product.productTotalPrice += Math.ceil(item.productTotalPrice)
    })

    product.productAddons.forEach((item: any) => {
      product.productTotalPrice += item.productTotalPrice
    })
  }

  addProductQuantity(product: any, type: any) {
    this.customizeBillCalculation(product)
    if (type === 'adding') {
      product.productQuantity = product.productQuantity + 1
    } else if (type === 'subtracting') {
      if (product.productQuantity === 1) return
      product.productQuantity = product.productQuantity - 1
    }
    product.productTotalPrice = product.productTotalPrice * product.productQuantity
  }

  getSubTotal() {
    let total = 0
    if (this.cartProducts && this.cartProducts.length) {
      this.cartProducts.forEach((item: any) => {
        total += item.productTotalPrice
      })
    }
    return total
  }

  editToCart() {
    this.cartService.addToCart(this.cartService.singleCustomProductObj, true);
    document.getElementById("entityId-order-online")?.click()
  }

  editFromCart(product: any) {
    // document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:none')
    this.cartService.setProductRateSize(product)
    this.cartService.singleCustomProductObj = JSON.parse(JSON.stringify(product))
    this.cartService.singleCustomProductObj.isEditable = true
    this.cartService.selectProductRatesField.setValue(product.productServingSize)
    $('#pageId-productCustomizeModal').modal('show')
  }

  showProductInfo(product: any) {
    this.cartService.setProductRateSize(product)
    // document.getElementsByClassName('cart-modal-wrapper')[0].setAttribute('style', 'display:none')
    this.cartService.singleCustomProductObj = JSON.parse(JSON.stringify(product))
    this.cartService.singleCustomProductObj.isShowInfo = true
    this.cartService.singleCustomProductObj.isEditable = false
    this.cartService.slideToShow = 4
    this.cartService.selectProductRatesField.setValue(product.productServingSize)
    $('#pageId-productCustomizeModal').modal('show')
  }

  placeOrder() {
    this.cartProducts.forEach((item: any) => {
        item.status = true
      }
    )
    this.cartService.addToCart(this.cartProducts, true, 'place-order')
    console.log(this.cartProducts)
  }
}
