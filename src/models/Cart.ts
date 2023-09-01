import {
    checkVasItemValid,
    checkExistingItemAndAdd,
    checkExistingVasItemAndAdd, checkCartConditions,
} from "../util/tools";
import DefaultItem from "./Items/DefaultItem";
import DigitalItem from "./Items/DigitalItem";
import VasItem from "./Items/VasItem";
import Item from "./Items/Item";
import Promotion from "./Promotions/Promotion";
import CategoryPromotion from "./Promotions/CategoryPromotion";
import SameSellerPromotion from "./Promotions/SameSellerPromotion";
import TotalPricePromotion from "./Promotions/TotalPricePromotion";
import * as constants from "../util/constants";

class Cart {
    items: Item[];
    promotions: Promotion[];
    appliedPromotion?: Promotion;

    constructor() {
        this.items = [];
        this.promotions = [
            new CategoryPromotion(5676),
            new SameSellerPromotion(9909),
            new TotalPricePromotion(1232),
        ]
    }

    // Add an item to the cart
    addItem(item: Item): void {
        const cartSizeWithoutVasItems = this.items.length;
        if (cartSizeWithoutVasItems === constants.CART_MAX_ITEM_COUNT) throw new Error('Your cart is full!');

        checkCartConditions(item, this);

        const existingNonDigitalItem = this.items.find((itemInList) => !(itemInList instanceof DigitalItem));
        const existingDigitalItem = this.items.find((itemInList) => itemInList instanceof DigitalItem);

        if (item instanceof DigitalItem && existingNonDigitalItem) {
            throw new Error('Digital Items can only be added with digital items!');
        } else if (item instanceof DefaultItem && existingDigitalItem) {
            throw new Error('You cannot add default item to this cart because there are digital item(s) inside!');
        }

        checkExistingItemAndAdd(item, this);
    }

    addVasItem(vasItem: VasItem): void {
        checkCartConditions(vasItem, this);

        let belongingDefaultItem = this.items.find((itemInList) => itemInList.itemId === vasItem.upperItemId)

        if (belongingDefaultItem && (belongingDefaultItem instanceof DefaultItem)) {
            if (checkVasItemValid(vasItem, belongingDefaultItem)) {
                checkExistingVasItemAndAdd(vasItem, belongingDefaultItem);
            }
        } else {
            throw new Error('There is no default item in cart with this itemId!');
        }

    }

    // Remove an item from the cart by itemId.
    // If quantity is greater than 1, decrease the quantity by 1.
    removeItem(itemId: number): void {
        const itemToRemove = this.items.find((item) => item.itemId === itemId);
        if (itemToRemove) {
            if (itemToRemove.quantity > 1) {
                itemToRemove.quantity -= 1;
            } else {
                this.items = this.items.filter((item) => item.itemId !== itemId);
            }
        } else {
            this.deleteVasItemFromDefaultItem(itemId);
        }
    }

    // Remove a vas item from the default item and cart by vasItemId.
    // If quantity is greater than 1, decrease the quantity by 1.
    deleteVasItemFromDefaultItem(vasItemId: number): void {
        const defaultItem = <DefaultItem>this.items.find((item) => {
            if (item instanceof DefaultItem) {
                return item.vasItems.find((vasItem) => vasItem.itemId === vasItemId);
            }
        });
        if (defaultItem) {
            let vasItem = defaultItem.vasItems.find((vasItem) => vasItem.itemId === vasItemId);
            if (vasItem.quantity > 1) {
                vasItem.quantity--;
            } else {
                defaultItem.vasItems = defaultItem.vasItems.filter((vasItem) => vasItem.itemId !== vasItemId);
            }
        } else {
            throw new Error('Item not found!');
        }
    }

    // Reset the cart (empty all items)
    reset(): void {
        this.items = [];
        this.appliedPromotion = undefined;
    }

    // Get all the items in the cart with vas items
    getAllItems(): Item[] {
        return this.items.reduce((total, item) => {
            if (item instanceof DefaultItem) {
                return [...total, item, ...item.vasItems];
            } else {
                return [...total, item];
            }
        }, []);
    }

    // Calculate the total number of items in the cart with vas items
    getTotalNumberOfItems(): number {
        const totalNumberOfItemsWithoutVasItems = this.items.reduce((total, item) => total + item.quantity, 0);
        const totalNumberOfVasItems = this.items.reduce((total, item) => {
            if (item instanceof DefaultItem) {
                return total + item.vasItems.reduce((total, vasItem) => total + vasItem.quantity, 0);
            } else {
                return total;
            }
        }, 0);
        return totalNumberOfItemsWithoutVasItems + totalNumberOfVasItems;
    }

    // Calculate the total price of all items in the cart
    calculateTotalPrice(): number {
        const totalPriceOfItems = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
        const totalPriceOfVasItems = this.items.reduce((total, item) => {
            if (item instanceof DefaultItem) {
                return total + item.vasItems.reduce((total, vasItem) => total + vasItem.price * vasItem.quantity, 0);
            } else {
                return total;
            }
        }, 0);
        return totalPriceOfItems + totalPriceOfVasItems;
    }

    getCartContent(): string {
        let totalPrice = this.calculateTotalPrice();
        let bestDiscount = this.getBestDiscount(totalPrice);
        const cartContent = {
            items: this.items.reduce((accumulator, item) => {
                if (item instanceof DefaultItem) {
                    const vasItemsWithoutUpperItemId = item.vasItems.map(({upperItemId, ...rest}) => rest);
                    const newItem = {
                        itemId: item.itemId,
                        categoryId: item.categoryId,
                        sellerId: item.sellerId,
                        price: item.price,
                        quantity: item.quantity,
                        vasItems: vasItemsWithoutUpperItemId
                    };
                    accumulator.push(newItem);
                } else if (item instanceof DigitalItem) {
                    const newItem = {
                        itemId: item.itemId,
                        categoryId: item.categoryId,
                        sellerId: item.sellerId,
                        price: item.price,
                        quantity: item.quantity
                    };
                    accumulator.push(newItem);
                }
                return accumulator;
            }, []),
            totalPrice: totalPrice - bestDiscount > 0 ? totalPrice - bestDiscount : 0,
            appliedPromotionId: this.appliedPromotion ? this.appliedPromotion.promotionId : null,
            totalDiscount: bestDiscount,
        };
        return JSON.stringify(cartContent);
    }

    getBestDiscount(totalPrice: number): number {
        let maxDiscount = 0;
        let bestPromotion: Promotion | null = null;
        let itemArray = this.getAllItems();

        for (const promotion of this.promotions) {
            if (promotion instanceof SameSellerPromotion) {
                itemArray = this.items
            }
            const discount = promotion.calculateDiscount(itemArray, totalPrice);
            if (discount > maxDiscount) {
                maxDiscount = discount;
                bestPromotion = promotion;
            }
        }
        if (bestPromotion) {
            this.appliedPromotion = bestPromotion;
        }
        return maxDiscount;
    }
}

export default Cart;