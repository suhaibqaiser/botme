import { Category } from "./model";

export async function createCategory(category: any) {
    return Category.create(category)
}

export async function getCategory(restaurantId: string) {
    return Category.find({ restaurantId: restaurantId })
}

export async function updateCategory(category: any) {
    return Category.findOneAndUpdate({ categoryId: category.categoryId }, category)
}

export async function deleteCategory(categoryId: any, restaurantId: string) {
    return Category.findOneAndDelete({ categoryId: categoryId, restaurantId: restaurantId })
}