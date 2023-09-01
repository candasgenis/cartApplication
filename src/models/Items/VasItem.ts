import Item from "./Item";

export default class VasItem implements Item {
    itemId: number;
    categoryId: number;
    sellerId: number;
    price: number;
    quantity: number;
    upperItemId: number | undefined;

    constructor(itemId: number, categoryId: number, sellerId: number, price: number, quantity: number, upperItemId: number) {
        this.itemId = itemId;
        this.categoryId = categoryId;
        this.sellerId = sellerId;
        this.price = price;
        this.quantity = quantity;
        this.upperItemId = upperItemId;
    }

    createItem(): VasItem {
        if (this.sellerId === 5003) {
            return this;
        } else {
            throw new Error('Invalid seller id for VasItem!');
        }
    }
}