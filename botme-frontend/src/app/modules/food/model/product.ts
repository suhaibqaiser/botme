export interface Product {
    restaurantId: string;
    productId: string;
    productName: string;
    productUOM: string;
    productType: string;
    productCategory: string;
    productSerialNo: string;
    productBarcode: string;
    productDesc: string;
    productIngredients: string;
    productRate: {
        standard: number;
        small: number;
        large: number;
        meal: number;
        addon: number;
    };
    productFlavor: [string];
    productProportion: [string];
    productToppings: [string];
    productAddons: [string];
    productNutrition: {
        calories: string;
        fats: string;
        proteins: string
    };
    productMeal: {
        food: [string];
        drink: [string];
    }
    productHistory: string;
    productImage: [string];
    productTags: [string];
    productAttributes: {
        halal: boolean;
        vegan: boolean;
        vegetarian: boolean;
        glutenFree: boolean;

    };
    offeringTime: [string];
    productVariant: [string];
    productActive: boolean;
    updatedAt: any;
    createdAt: any;
}