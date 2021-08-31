import {Component, OnInit} from '@angular/core';
import {MenuService} from 'src/app/services/menu.service';
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../../services/cart.service";

@Component({
  selector: 'app-product-detail-section',
  templateUrl: './product-detail-section.component.html',
  styleUrls: ['./product-detail-section.component.scss']
})
export class ProductDetailSectionComponent implements OnInit {

  product: any
  categories: any

  constructor(private cartService: CartService, private route: ActivatedRoute, private menuservice: MenuService) {
  }

  async ngOnInit() {
    await this.getCategory()
    await this.getProductDetail(this.route.snapshot.queryParams['productId'])
  }

  async getProductDetail(productId: string) {
    this.menuservice.getProductById(productId).subscribe(
      async result => {
        if (result.status === 'success') {
          this.product = result.payload[0]
          this.product.productCategoryName = await this.getCategoryName(this.product.productCategory);
          console.log(this.product)
        }
      }
    );
  }

  async getCategory() {
    return this.menuservice.getCategory()
      .subscribe(result => {
        this.categories = result.payload
        return result.payload
      });
  }

  async getCategoryName(catId: string) {
    let cat: any = this.categories.find((category: { categoryId: string; }) => category.categoryId === catId);
    if (cat) return cat.categoryName

    return null;
  }

  addToCart(productId: string) {
    this.cartService.addToCart(productId);
    document.getElementById("btnProductCart")?.click()
  }
}
