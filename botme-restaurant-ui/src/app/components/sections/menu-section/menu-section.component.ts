import {Component, OnInit} from '@angular/core';
import {MenuService} from 'src/app/services/menu.service';

@Component({
  selector: 'app-menu-section',
  templateUrl: './menu-section.component.html',
  styleUrls: ['./menu-section.component.scss']
})
export class MenuSectionComponent implements OnInit {

  products: any
  categories = []
  categoryList: { categoryId: string, categoryName: string }[] = []
  loading = true

  constructor(private menuservice: MenuService) {
  }

  ngOnInit(): void {
    this.menuservice.getProductList().subscribe((res: any) => {
      this.products = res
      console.log('getProductList =>', res)
    })

    this.menuservice.getCategoryList().subscribe((res: any) => {
      this.categories = res
      this.categoryList = res
      console.log('getCategoryList =>', res)
    })
    this.getProducts()
  }

  getProducts(): void {
    if (Array.isArray(this.products)) {
      for (let product of this.products) {
        product.productCategoryName = this.getCategoryName(product.productCategory);
        (!this.categoryList.find(category => category.categoryId === product.productCategory)) ?
          this.categoryList.push({
            categoryId: product.productCategory,
            categoryName: product.productCategoryName
          }) : null;
        this.loading = false;
      }
    } else {
      this.products = []
      this.loading = false;
    }
  }

  getProductsByCategory(category: string) {
    let products: any = this.products.filter((product: { productCategory: string; }) => product.productCategory === category);
    return products;
  }

  getCategoryName(catId: string) {
    let cat: any = this.categories.find((category: { categoryId: string; }) => category.categoryId === catId);
    if (cat) return cat.categoryName
    return null;
  }


}
