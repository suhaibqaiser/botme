import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { MenuService } from 'src/app/services/menu.service';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-search-grid-section',
  templateUrl: './search-grid-section.component.html',
  styleUrls: ['./search-grid-section.component.scss']
})
export class SearchGridSectionComponent implements OnInit {

  products: any
  filteredProducts: any
  categories = []
  categoryList: { categoryId: string, categoryName: string }[] = []
  loading = true
  cartVisible = false;
  sofiaMessage = "Message from Sofia"


  constructor(private menuservice: MenuService,
    private cartService: CartService,
    private socketService: SocketService) { }

  ngOnInit(): void {
    this.getCategory();
    this.getWSMessage();
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
            this.filteredProducts = this.products
            this.loading = false;
          }
        } else {
          this.products = []
          this.filteredProducts = this.products
          this.loading = false;
        }
        console.log(this.filteredProducts)
      });
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

  filterProducts(categoryId: string) {
    this.filteredProducts = this.products.filter((product: { productCategory: string; }) => product.productCategory === categoryId);
  }

  filterProductsByName(text: string) {
    this.filteredProducts = this.products.filter((product: { productName: string; }) => product.productName.toLowerCase().indexOf(text) >= 0);
  }


  addToCart(productId: string) {
    this.cartService.addToCart(productId);
    document.getElementById("btnProductCart")?.click()
  }

  sendWSMessage(text: string) {
    this.socketService.sendMessage(text);
  }

  getWSMessage() {
    this.socketService.messages.subscribe(r => {
      let res: any = r
      this.sofiaMessage = res.message.text
    }
    )
  }
}
