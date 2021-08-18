import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-menu-section',
  templateUrl: './menu-section.component.html',
  styleUrls: ['./menu-section.component.scss']
})
export class MenuSectionComponent implements OnInit {

  constructor(private menuservice: MenuService) { }

  products: any
  categories = []
  categoryList: string[] = []
  loading = true


  ngOnInit(): void {
    this.getCategory()
  }

  getProducts(): void {
    this.menuservice.getProducts()
      .subscribe(result => {
        this.products = result.payload

        if (Array.isArray(this.products)) {
          for (let product of this.products) {
            product.productCategory = this.getCategoryName(product.productCategory);
            (!this.categoryList.find(element => element === product.productCategory)) ? this.categoryList.push(product.productCategory) : null;
            this.loading = false;
          }
        } else {
          this.products = []
          this.loading = false;
        }
      });
  }

  getProductsByCategory(category: string) {
    let prods: any = this.products.filter((product: { productCategory: string; }) => product.productCategory === category);
    return prods;
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
