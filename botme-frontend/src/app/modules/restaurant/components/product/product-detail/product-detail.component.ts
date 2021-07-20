import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../model/product';
import { CategoryService } from '../../../service/category.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(private productservice: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute, private fb: FormBuilder) {
  }

  productForm = this.fb.group({
    productName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    productDesc: new FormControl('', [Validators.maxLength(300)]),
    productImage: new FormControl(''),
    productAddon: new FormControl(''),
    productVariant: new FormControl(''),
    productPrice: new FormControl('', [Validators.required]),
    category: new FormControl(''),
    productActive: true,
  });

  formMode = 'update';
  productId = '';
  categories: any
  addons: any
  variants: any

  product: Product = {
    productId: '',
    productName: '',
    productDesc: '',
    productImage: [null],
    productAddon: [null],
    productVariant: [null],
    productPrice: 0,
    productActive: true,
    category: null
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.productId = params.productId;
      });
    this.getCategories()
    this.getProductAddons('60ddd76cea63a8111ebaa0b2')

    if (!this.productId) {
      this.formMode = 'new'
    } else {
      this.getProductDetail(this.productId);
    }
  }

  onSubmit(): void {


    if (this.productForm.invalid) {
      return;
    }

    if (this.formMode === 'update') {
      this.updateProduct();
    } else {
      this.addProduct()
    }
  }

  getProductDetail(productId: string): void {
    this.productservice.getProductById(productId).subscribe(
      result => {
        this.product = result.payload[0]
        this.productForm.patchValue({
          productName: this.product.productName,
          productDesc: this.product?.productDesc,
          productImage: this.product?.productImage,
          productAddon: this.product?.productAddon,
          productVariant: this.product?.productVariant,
          productPrice: this.product.productPrice,
          productActive: this.product.productActive,
          category: this.product?.category._id,
        });
        this.getProductVariants(this.product.category._id);
      }
    );
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      result => {
        this.categories = result.payload
      }
    )
  }

  getProductAddons(category: string): void {
    this.productservice.getProductsByCategory(category).subscribe(
      result => {
        this.addons = result.payload
      })
  }

  getProductVariants(category: string): void {
    this.productservice.getProductsByCategory(category).subscribe(
      result => {
        this.variants = result.payload
      })
  }

  updateProduct(): void {
    this.product.productId = this.productId
    this.product.productName = this.productForm.getRawValue().productName
    this.product.productDesc = this.productForm.getRawValue().productDesc
    this.product.productImage = this.productForm.getRawValue().productImage
    this.product.productAddon = this.productForm.getRawValue().productAddon
    this.product.productVariant = this.productForm.getRawValue().productVariant
    this.product.productPrice = this.productForm.getRawValue().productPrice
    this.product.productActive = this.productForm.getRawValue().productActive
    this.product.category = this.productForm.getRawValue().category._id

    this.productservice.updateProduct(this.product)
      .subscribe(result => this.product = result.payload);

  }

  addProduct() {
    this.product.productName = this.productForm.getRawValue().productName
    this.product.productDesc = this.productForm.getRawValue().productDesc
    this.product.productImage = this.productForm.getRawValue().productImage
    this.product.productAddon = this.productForm.getRawValue().productAddon
    this.product.productVariant = this.productForm.getRawValue().productVariant
    this.product.productPrice = this.productForm.getRawValue().productPrice
    this.product.productActive = this.productForm.getRawValue().productActive
    this.product.category = this.productForm.getRawValue().category

    this.productservice.addProduct(this.product)
      .subscribe(result => this.product = result.payload)
  }

}
