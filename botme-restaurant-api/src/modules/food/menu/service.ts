import { Menu } from "./model";

export async function createMenu(menu: any) {
    return Menu.create(menu)
}

export async function getMenu(menuId: string, restaurantId: string) {
    return Menu.findOne({ menuId: menuId, restaurantId: restaurantId })
        .populate("menuItems.category")
        .populate("menuItems.products")
}