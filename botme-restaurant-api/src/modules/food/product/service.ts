import { Product } from "./model";

export async function createProduct(product: any) {
    return Product.create(product)
}

export async function getProduct(queryParams: any, sort: any) {
    if (parseInt(sort)) {
        return Product.find(queryParams, {
            __v: 0,
            _id: 0,
            "productOptions._id": 0
        }).sort({ 'productRate.standard': parseInt(sort) })
    }
    return Product.find(queryParams, { __v: 0, _id: 0, "productOptions._id": 0 })

}

export async function getProductByTag(tag: string, person: number, restaurantId: string, attributes?: any) {
    let filter: any = {
        "productTags": tag,
        "productServing": { $lte: person }, "restaurantId": restaurantId,
    }
    if (attributes) {
        if (attributes.vegan) {
            filter["productAttributes.vegan"] = true;
        }
        if (attributes.halal) {
            filter["productAttributes.halal"] = true;
        }
        if (attributes.vegetarian) {
            filter["productAttributes.vegetarian"] = true;
        }
        if (attributes.glutenFree) {
            filter["productAttributes.glutenFree"] = true;
        }
        console.log(filter);
    }


    return Product.find(filter, {
        "productId": 1,
        _id: 0,
    })

}
export async function getProductByTagWithoutAttribute(tag: string, person: number, restaurantId: string) {
    let filter: any = {
        "productTags": tag,
        "productServing": { $lte: person }, "restaurantId": restaurantId,
    }
    // if (attributes) {
    //     if (attributes.vegan) {
    //         filter["productAttributes.vegan"] = true;
    //     }
    //     if (attributes.halal) {
    //         filter["productAttributes.halal"] = true;
    //     }
    //     if (attributes.vegetarian) {
    //         filter["productAttributes.vegetarian"] = true;
    //     }
    //     if (attributes.glutenFree) {
    //         filter["productAttributes.glutenFree"] = true;
    //     }
    //     console.log(filter);
    // }

    return Product.find(filter, {
        "productId": 1,
        _id: 0,
    })

}

export async function updateProduct(product: any) {
    return Product.findOneAndUpdate({ productId: product.productId }, product)
}

export async function getMaxLabelValue() {
    return Product.findOne({}).sort({ productLabel: -1 })
}

