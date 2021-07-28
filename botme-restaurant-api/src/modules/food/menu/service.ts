import {Menu} from "./model";

export async function createMenu(menu: any) {
    return Menu.create(menu)
}

export async function getMenu(menuId: string) {
    return Menu.findOne({menuId})
        .populate("menuItems.category")
        .populate("menuItems.products")
}