import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cartProducts = new Subject();

    cartProduct: string[] = []

    constructor() {
        this.getFromLocalstorage();
    }

    getFromLocalstorage() {
        let _cartProducts = localStorage.getItem('cart-products');
        (_cartProducts) ? this.cartProduct = JSON.parse(_cartProducts) : null;
        this.cartProducts.next(JSON.stringify(this.cartProduct));
    }

    setToLocalStorage(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
        this.cartProducts.next(JSON.stringify(this.cartProduct));
    }

    addToCart(productId: any) {
        this.cartProduct.push(productId);
        this.setToLocalStorage("cart-products", this.cartProduct);
    }

    removeFromCart(productId: string) {
        this.cartProduct.splice(this.cartProduct.indexOf(productId), 1);
        this.setToLocalStorage("cart-products", this.cartProduct);
    }

    getCartProducts(): Observable<any> {
        this.getFromLocalstorage();
        return this.cartProducts.asObservable();
    }



}
