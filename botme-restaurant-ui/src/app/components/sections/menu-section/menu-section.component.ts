import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';

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

  constructor(private menuservice: MenuService) { }

  ngOnInit(): void {
    this.getCategory()
  }

  getProducts(): void {
    this.menuservice.getProducts()
      .subscribe(result => {
        this.products = result.payload

        if (Array.isArray(this.products)) {
          for (let product of this.products) {
            product.productCategoryName = this.getCategoryName(product.productCategory);
            (!this.categoryList.find(category => category.categoryId === product.productCategory)) ?
              this.categoryList.push({ categoryId: product.productCategory, categoryName: product.productCategoryName }) : null;
            this.loading = false;
          }
        } else {
          this.products = []
          this.loading = false;
        }
      });
    console.log(this.categoryList);
  }

  getProductsByCategory(category: string) {
    let products: any = this.products.filter((product: { productCategory: string; }) => product.productCategory === category);
    return products;
  }

  getCategory() {
    this.menuservice.getCategory()
      .subscribe(result => {
        this.categories = result.payload

        if (Array.isArray(this.categories)) {
          this.getProducts();
        } else {
          this.categories = []
        }
      });
  }

  getCategoryName(catId: string) {
    let cat: any = this.categories.find((category: { categoryId: string; }) => category.categoryId === catId);
    if (cat) return cat.categoryName

    return null;
  }

 
}
