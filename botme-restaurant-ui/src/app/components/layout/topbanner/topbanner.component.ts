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
  corusalProductList: any = [
    {
      productId: '4731852b-aabb-42b5-99cf-22447903f79e',
      productName: 'Nacho Burger',
      productDescription: 'A simple burger with lettuce and nachos with single patty',
      productPrice: 5.99,
      productImage: ['Nacho Burger.jpg']
    },
    {
      productId: '8a676882-6173-49b4-b123-866899b796eb',
      productName: 'Falafel Sandwich',
      productDescription: '6 pieces of falafel served with lettuce, tomato, pickle, turnip, parsl...',
      productPrice: 12.99,
      productImage: ['Falafel Sandwich.jpg']
    },
    {
      productId: 'ba0b7491-3431-4884-bfae-b0f6faef7cda',
      productName: 'Chicken Tenders',
      productDescription: '2 pieces of chicken tenders',
      productPrice: 7.99,
      productImage: ['Chicken Tenders.jpg']
    }
  ]

  constructor(private menuService: MenuService) {
  }

  async ngOnInit() {
    await this.getCategory()
  }

  async getCategory() {
    this.menuService.getCategory()
      .subscribe(async result => {
        this.categories = result.payload
        console.log('categories', result.payload)
        if (Array.isArray(this.categories)) {
          await this.getProducts();
        } else {
          this.categories = []
        }
        return
      });
  }

  resolveImages(product: any) {
    if (product.productImage && product.productImage.length) {
      return 'assets/images/products/' + product.productImage[0]
    }
    return 'assets/images/product-1.png'
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
