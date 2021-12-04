import {Component, OnInit} from '@angular/core';
import {HelperService} from "../../../services/helper.service";

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
      productDescription: '6 pieces of falafel served with lettuce, tomato, pickle, turnip, parsley, onion and tahini sauce.',
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

  constructor(public _helperService: HelperService) {
  }

  async ngOnInit() {

  }
}
