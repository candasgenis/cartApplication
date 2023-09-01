import Cart from "../models/Cart";
import DigitalItem from "../models/Items/DigitalItem";
import VasItem from "../models/Items/VasItem";
import DefaultItem from "../models/Items/DefaultItem";
import {DEFAULT_ITEM_MAX_QUANTITY, DIGITAL_ITEM_MAX_QUANTITY} from "./constants";
import * as constants from "./constants";
import Item from "../models/Items/Item";

// Checks if item to be added is exactly the same as the existing item.
export function checkExistingItemSame(existingItem: DefaultItem | DigitalItem, item: DefaultItem | DigitalItem): boolean {
    return existingItem.itemId === item.itemId &&
        existingItem.categoryId === item.categoryId &&
        existingItem.sellerId === item.sellerId &&
        existingItem.price === item.price;
}

export function checkVasItemValid(vasItem: VasItem, belongingDefaultItem: DefaultItem): boolean {
    if (!(belongingDefaultItem.categoryId === 1001 || belongingDefaultItem.categoryId === 3004)) {
        throw new Error('Vas item cannot be added to this item!(Check category id of default item)');
    }
    const totalVasItemQuantityOfDefaultItem = belongingDefaultItem.vasItems.reduce((accumulator, vasItem) => {
        return accumulator + vasItem.quantity;
    }, 0);
    if (!(totalVasItemQuantityOfDefaultItem + vasItem.quantity <= constants.VAS_ITEM_MAX_QUANTITY)) {
        throw new Error(`Vas item quantity cannot exceed ${constants.VAS_ITEM_MAX_QUANTITY}!`);
    }
    if (!(vasItem.price <= belongingDefaultItem.price)) {
        throw new Error('Vas item price cannot exceed default item price!');
    }
    return true;
}

export function checkExistingItemAndAdd(item: any, cart: Cart): void {
    const existingItem = cart.items.find((itemInList) => itemInList.itemId === item.itemId);
    let maxQuantity: number;
    if (item instanceof DigitalItem) {
        maxQuantity = DIGITAL_ITEM_MAX_QUANTITY;
    } else {
        maxQuantity = DEFAULT_ITEM_MAX_QUANTITY;
    }
    if (existingItem?.quantity + item.quantity > maxQuantity)
        throw new Error('Exceeded max quantity of items in the cart! ' +
            '(For digital items, max quantity is 5. For default items, max quantity is 10.)');
    if (existingItem) {
        if (!checkExistingItemSame(existingItem, item))
            throw new Error('Item to be added is not the same as the existing item!(Check the given item info)');
        existingItem.quantity += item.quantity;
    } else {
        cart.items.push(item);
    }
}

export function checkExistingVasItemAndAdd(vasItem: VasItem, belongingDefaultItem: DefaultItem): void {
    const existingVasItem = belongingDefaultItem.vasItems.find((vasItemInList) => vasItemInList.itemId === vasItem.itemId);
    if (existingVasItem?.quantity + vasItem.quantity > 3)
        throw new Error('Exceeded max quantity of vas items in the cart! (Max quantity is 3.)');
    if (existingVasItem) {
        existingVasItem.quantity += vasItem.quantity;
    } else {
        belongingDefaultItem.vasItems.push(vasItem);
    }
}

export function checkCartConditions(item: Item, cart: Cart) {
    if (item.quantity <= 0) throw new Error('Item quantity must be greater than 0!');
    if (item.price <= 0) throw new Error('Item price must be greater than 0!');
    const totalNumberOfItems = cart.getTotalNumberOfItems() + item.quantity;
    if (totalNumberOfItems > constants.CART_MAX_ITEM_QUANTITY)
        throw new Error(`Total quantity of items in the cart cannot exceed ${constants.CART_MAX_ITEM_QUANTITY}!`);
    if (cart.calculateTotalPrice() + item.price * item.quantity > constants.CART_MAX_TOTAL_PRICE)
        throw new Error(`Total price of items in the cart cannot exceed ${constants.CART_MAX_TOTAL_PRICE}!`);
}
