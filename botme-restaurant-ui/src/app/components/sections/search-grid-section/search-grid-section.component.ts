import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { MenuService } from 'src/app/services/menu.service';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-search-grid-section',
  templateUrl: './search-grid-section.component.html',
  styleUrls: ['./search-grid-section.component.scss']
})
export class SearchGridSectionComponent implements OnInit, OnDestroy {

  products: any
  filteredProducts: any
  categories = []
  categoryList: { categoryId: string, categoryName: string }[] = []
  loading = true
  cartVisible = false;

  wsPayload = {
    "clientID": "987530c0-998d-4cfc-b86d-596b5f7cd7d7",
    "current_time": "2021-04-07 00:49:00",
    "message_format": "text",
    "message_command": "find",
    "language": "en-US",
    "message_text": "Hey",
    "authToken": "qbw/fcQKvC6SY+AelUs5VpRYOhnRvzZsz39xVU06LYI="
  }


  constructor(private menuservice: MenuService,
    private cartService: CartService,
    private socketService: SocketService) { }

  ngOnInit(): void {
    this.getCategory();

    this.socketService.connect();
    this.socketService.messages$.subscribe(r => {
      console.log(r);
    })

    this.socketService.sendMessage("Hi");
    this.socketService.sendMessage(this.wsPayload);
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

  callToAction(input: any) {
    let CTAJson = JSON.parse(input);
    let ctaId = CTAJson.action.entity.entityId

    let cta = document.getElementById(ctaId)
    let btn: HTMLElement = cta?.getElementsByTagName('a')[0] as HTMLElement;
    //let btn: HTMLElement = cta?.getElementsByClassName('btn-yellow')[0] as HTMLElement;
    btn.click();
  }

  ngOnDestroy() {
    this.socketService.close();
  }
}
