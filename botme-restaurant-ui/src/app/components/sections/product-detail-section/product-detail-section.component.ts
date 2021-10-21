import {Component, OnInit} from '@angular/core';
import {MenuService} from 'src/app/services/menu.service';
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../../services/cart.service";
import {SocketService} from "../../../services/socket.service";

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

  constructor(public _socketService: SocketService, public cartService: CartService, private route: ActivatedRoute, private menuservice: MenuService) {
  }

  async ngOnInit() {
    await this.getProducts()
    await this.getCategory()
    await this.getProductDetail(this.route.snapshot.queryParams['productId'])
    await this.getRelatedProducts()

    this._socketService.pageId = 'pageId-product-detial-page'
    this._socketService.sectionId = 'sectionId-product-detial-page'
  }

  async getProductDetail(productId: string) {
    this.menuservice.getProductById(productId).subscribe(
      async result => {
        if (result.status === 'success') {
          this.product = result.payload[0]
          this.product.productCategoryName = await this.getCategoryName(this.product.productCategory);
          console.log('product =>', this.product)
        }
      }
    );
  }

  async getProducts() {
    this.menuservice.getProducts()
      .subscribe(result => {
        this.cartService.products = result.payload
      });
  }

  async getCategory() {
    return this.menuservice.getCategory()
      .subscribe(result => {
        this.categories = result.payload
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
    // document.getElementById("btnProductCart")?.click()
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

  resolveImages() {
    if (this.product.productImage && this.product.productImage.length) {
      return 'assets/images/products/' + this.product.productImage[0]
    }
    return 'assets/images/product-1.png'
  }
}
