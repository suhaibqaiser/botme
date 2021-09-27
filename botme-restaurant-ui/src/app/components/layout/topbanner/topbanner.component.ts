import {Component, OnInit} from '@angular/core';
import {MenuService} from "../../../services/menu.service";

@Component({
  selector: 'app-topbanner',
  templateUrl: './topbanner.component.html',
  styleUrls: ['./topbanner.component.scss']
})
export class TopbannerComponent implements OnInit {

  categories: any = []
  products: any = []
  corusalProductList: any = []

  constructor(private menuService: MenuService) {
  }

  async ngOnInit() {
    await this.getCategory()
  }

  async getCategory() {
    this.menuService.getCategory()
      .subscribe(result => {
        this.categories = result.payload
        console.log('categories', result.payload)
        if (Array.isArray(this.categories)) {
          this.getProducts();
        } else {
          this.categories = []
        }
        return
      });
  }

  async getProducts() {
    this.menuService.getProducts()
      .subscribe(result => {
        this.products = result.payload

        if (Array.isArray(this.products)) {
          for (let product of this.products) {
            product.productCategoryName = this.getCategoryName(product.productCategory);
            if (product.productCategoryName.toLowerCase() === 'burgers' || product.productCategoryName.toLowerCase() === 'sandwich' || product.productCategoryName.toLowerCase() === 'kids meal') {
              this.corusalProductList.push(product)
            }
          }
        } else {
          this.products = []
        }
        console.log(this.corusalProductList)
      });
  }

  getCategoryName(catId: string) {
    let cat: any = this.categories.find((category: { categoryId: string; }) => category.categoryId === catId);
    if (cat) return cat.categoryName

    return null;
  }
}
