import {Menu} from "./model";

export async function getAllMenus() {
    return Menu.find({});
}

export async function createMenu(menu: any) {
    return Menu.create(menu)
}

export async function updateMenu(menu: any) {
    return Menu.findOneAndUpdate({"menuId": menu.menuId}, menu, {returnOriginal: true});
}

export async function getMenu(queryParams: any) {
    return Menu.find(queryParams);
}

export async function getMaxLabelValue() {
    return Menu.findOne({}).sort({menuLabel: -1})
}
