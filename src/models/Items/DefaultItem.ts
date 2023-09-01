import Item from "./Item";
import vasItem from "./VasItem";

export default class DefaultItem implements Item {
    itemId: number;
    categoryId: number;
    sellerId: number;
    price: number;
    quantity: number;
    vasItems: vasItem[];

    constructor(itemId: number, categoryId: number, sellerId: number, price: number, quantity: number, vasItems: vasItem[]) {
        this.itemId = itemId;
        this.categoryId = categoryId;
        this.sellerId = sellerId;
        this.price = price;
        this.quantity = quantity;
        this.vasItems = vasItems;
    }

    createItem(): DefaultItem {
        return this;
    }

}