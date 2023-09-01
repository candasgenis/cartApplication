export default interface Item {
    itemId: number;
    categoryId: number;
    sellerId: number;
    price: number;
    quantity: number;

    createItem(): Item;
}