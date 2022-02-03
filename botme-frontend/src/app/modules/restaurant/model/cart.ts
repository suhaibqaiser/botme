export interface Cart {
  restaurantId: '',
  cartId: '',
  orderLabel: '',
  productId:'',
  productSerialNo: '',
  productCategory: '',
  productFlavor: '',
  productProportion: [{
    productId: '',
    productQuantity: 0
  }],
  productToppings: [{
    productId: '',
    productQuantity:0
  }],
  productOptions: [{
    productId:'',
    productQuantity:0
  }],
  productIngredients: [{
    productId: '',
    productQuantity: 0
  }],
  productRate: {
    standard: 0,
    small: 0,
    medium: 0,
    large: 0,
  },
  productQuantity: 0,
  productNotes: '', // customization Instructions
  status: false,
  productTotalPrice: 0,
  cartDiscount: 0,
  cartTotal: 0,
}

export interface cartProduct {
    productId: string,
    productLabel: string,
    productCategory: string,
    productFlavor: string,
    productProportion: string,
    productToppings: [string],
    productOptions: [[string]],
    productRate: {
        standard: number,
        small: number,
        medium: number,
        large: number,
    },
    productQuantity: number,
    productNotes: string
}
