import {Category} from "./model";

export async function createCategory(category: any) {
    return Category.create(category)
}