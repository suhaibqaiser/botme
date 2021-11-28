import {Component, OnInit} from '@angular/core';
import {MenuService} from 'src/app/services/menu.service';
import {ActivatedRoute, Router} from "@angular/router";
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

  constructor(private router: Router, public _socketService: SocketService, public cartService: CartService, private route: ActivatedRoute, private menuservice: MenuService) {
  }

  async ngOnInit() {
    this._socketService.getCurrentContext()
    await this.menuservice.getCategoryList().subscribe((res: any) => {
      this.categories = res
      console.log('getCategoryList =>', res)
    })

    await this.menuservice.getProductList().subscribe((res: any) => {
      this.product = res
      this.cartService.products = res
      console.log('this.product =>', this.product)
      this.product = this.product.find((item: any) => item.productId === this.router.url.split('/')[2])
    })
  }

  async getCategoryName(catId: string) {
    let cat: any = await this.categories.find((category: { categoryId: string; }) => category.categoryId === catId);
    console.log('getCategoryName', cat)
    if (cat) return cat.categoryName

    return null;
  }

  addToCart(product: any) {
    this.cartService.setProductCustomization(JSON.parse(JSON.stringify(product)))
  }

  resolveImages() {
    console.log(this.product)
    if (this.product && this.product.productImage && this.product.productImage.length) {
      return 'assets/images/products/' + this.product.productImage[0]
    }
    return 'assets/images/product-1.png'
  }
}
