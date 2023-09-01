import Item from "./Item";

export default class DigitalItem implements Item {
    itemId: number;
    categoryId: number;
    sellerId: number;
    price: number;
    quantity: number;
    constructor(itemId: number, categoryId: number, sellerId: number, price: number, quantity: number) {
        this.itemId = itemId;
        this.categoryId = categoryId;
        this.sellerId = sellerId;
        this.price = price;
        this.quantity = quantity;
    }

    createItem(): DigitalItem {
        return this;
    }

}