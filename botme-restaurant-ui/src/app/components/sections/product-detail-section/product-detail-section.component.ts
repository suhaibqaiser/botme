import {Component, OnInit} from '@angular/core';
import {MenuService} from 'src/app/services/menu.service';
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from "../../../services/cart.service";
import {SocketService} from "../../../services/socket.service";
import {HelperService} from "../../../services/helper.service";
import {ContextService} from "../../../services/context.service";

declare var $: any;

@Component({
  selector: 'app-product-detail-section',
  templateUrl: './product-detail-section.component.html',
  styleUrls: ['./product-detail-section.component.scss']
})
export class ProductDetailSectionComponent implements OnInit {

  product: any
  categories: any
  relatedProduct: any
  productsList: any
  queryProductId: any
  loader: any = false

  constructor(private _contextService: ContextService, private _route: ActivatedRoute, public _helperService: HelperService, private router: Router, public _socketService: SocketService, public cartService: CartService, private route: ActivatedRoute, private menuservice: MenuService) {
  }

  async ngOnInit() {

    this._route.queryParams.subscribe((param: any) => {
      this.queryProductId = (param && param.productId) ? param.productId : ''
    })

    if (!this.queryProductId && !this.queryProductId) {
      alert('Sorry product id not found!')
      return
    }

    await this.getProductDetail(this.queryProductId)
    await this.getCategory()
    await this.getProducts()
    await this.getRelatedProducts()

    this._contextService.getCurrentContext()
  }

  async getProductDetail(productId: string) {
    this.loader = true
    await this.menuservice.getProductById(productId).subscribe(
      async result => {
        if (result.status === 'success') {
          this.product = result.payload[0]
          this.product.productCategoryName = await this.getCategoryName(this.product.productCategory);
        }
      }
    );
    return
  }

  async getProducts() {
    this.menuservice.getProducts()
      .subscribe(result => {
        this.cartService.products = result.payload
        this._helperService.productList = result.payload
      });
  }

  async getCategory() {
    return this.menuservice.getCategory()
      .subscribe(result => {
        this.categories = result.payload
        this.loader = false
        return result.payload
      });
  }

  async getCategoryName(catId: string) {
    let cat: any = await this.categories.find((category: { categoryId: string; }) => category.categoryId === catId);
    if (cat) return cat.categoryName

    return null;
  }

  addToCart(product: any) {
    this.cartService.setProductCustomization(JSON.parse(JSON.stringify(product)))
    // document.getElementById("entityId-show-cart")?.click()
  }

  async getRelatedProducts() {
    return this.menuservice.getProducts()
      .subscribe(async result => {
        this.productsList = await result.payload
        await this.getProductByTags(await result.payload)
        return
      });
  }

  async getProductByTags(productsList: any) {
    this.relatedProduct = []
    this.productsList = await productsList
    if (Array.isArray(this.productsList)) {
      for (let product of this.productsList) {
        this.product.productCategoryName = await this.getCategoryName(this.product.productCategory);
        if (this.product.productCategoryName == product.productCategoryName || this.product.productType == product.productType || this.product.productTags.includes(product.productCategoryName) || this.product.productTags.includes(product.productName)) {
          this.relatedProduct.push(product)
        }
      }
    }
    return
  }
}
