import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-product-suggestion',
  templateUrl: './product-suggestion.component.html',
  styleUrls: ['./product-suggestion.component.scss']
})
export class ProductSuggestionComponent implements OnInit {

  constructor(private menuservice: MenuService) { }

  searchParameters: any = {};
  attributes: any = {}
  products: any
  suggestion: any = { products: [], drinks: [] };
  suggestedItems: any


  suggestionForm = new FormGroup({
    tags: new FormControl('', Validators.required),
    person: new FormControl(1, Validators.required),
    drinks: new FormControl('cold', Validators.required),
    vegan: new FormControl(false),
    halal: new FormControl(false),
    vegetarian: new FormControl(false),
    glutenFree: new FormControl(false),
  })

  ngOnInit(): void {
    this.getAllProducts()
  }

  getAllProducts() {
    this.menuservice.getProducts().subscribe((res: any) => {
      if (res.status == 'success') {
        this.products = res.payload;
        console.log(this.products);
      }
    })
  }

  suggest() {
    this.prepareParameters()
    console.log(this.searchParameters);
    this.suggestedItems = { products: [], drinks: [] };
    console.log("test",this.searchParameters)
    this.menuservice.getSuggestions(this.searchParameters).subscribe((res: any) => {
      console.log("test",res)
      if (res.status == 'success') {
        this.suggestion.products = res.payload.products;
        this.suggestion.drinks = res.payload.drinks;
        console.log(this.suggestion);

        this.suggestion.products.forEach((sugg: string) => {
          let s = this.products.filter((p: any) => p.productId === sugg)
          s.forEach((p: any) => { this.suggestedItems.products.push(p) })
        });

        this.suggestion.drinks.forEach((sugg: string) => {
          let s = this.products.filter((p: any) => p.productId === sugg)
          s.forEach((p: any) => { this.suggestedItems.drinks.push(p) })
        });
        console.log(this.suggestedItems);

      }
    })
  }

  prepareParameters() {
    this.searchParameters.tags = this.suggestionForm.get('tags')?.value.split(' ')
    this.searchParameters.persons = this.suggestionForm.get('person')?.value
    this.searchParameters.drinks = this.suggestionForm.get('drinks')?.value
    this.attributes.vegetarian = this.suggestionForm.get('vegetarian')?.value
    this.attributes.vegan = this.suggestionForm.get('vegan')?.value
    this.attributes.halal = this.suggestionForm.get('halal')?.value
    this.attributes.glutenFree = this.suggestionForm.get('glutenFree')?.value
    this.searchParameters.attributes = this.attributes
  }
}
