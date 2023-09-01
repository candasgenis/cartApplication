import DigitalItem from "./DigitalItem";
import DefaultItem from "./DefaultItem";
import VasItem from "./VasItem";

export default class ItemCreator {
    // Function to create item based on its category.
    // If the category is 7889, then it is a digital item.
    // If the category is 3242, then it is a vas item.
    // If the category is neither 7889 nor 3242, then it is a default item.
    // If the category is 3242, then it must have vasItemId.
    // If the category is 7889, then it must not have vasItemId.
    // If the category is neither 7889 nor 3242, then it must not have vasItemId.
    static specifyItem(itemId: number, categoryId: number, sellerId: number, price: number, quantity: number, vasItemId?: number): any {
        let specifiedItem;
        if (vasItemId && categoryId === 3242) {
            specifiedItem = new VasItem(vasItemId, categoryId, sellerId, price, quantity, itemId).createItem();
        } else if (!vasItemId) {
            if (categoryId === 7889) {
                specifiedItem = new DigitalItem(itemId, categoryId, sellerId, price, quantity).createItem();
            } else if (categoryId !== 3242) {
                specifiedItem = new DefaultItem(itemId, categoryId, sellerId, price, quantity, []).createItem();
            }
        } else {
            throw new Error('Invalid item!');
        }
        return specifiedItem;
    }
}