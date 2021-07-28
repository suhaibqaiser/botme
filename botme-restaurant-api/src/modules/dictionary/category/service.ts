import {Category} from "./model";

export async function createCategory(category: any) {
    return Category.create(category)
}

export async function getCategory() {
    return Category.find()
}

export async function updateCategory(category: any) {
    return Category.findOneAndUpdate({categoryId: category.categoryId}, category)
}

export async function deleteCategory(categoryId: any) {
    return Category.findOneAndDelete({categoryId: categoryId})
}