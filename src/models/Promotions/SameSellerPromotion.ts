import Promotion from "./Promotion";
import Item from "../Items/Item";

export default class SameSellerPromotion implements Promotion {
    promotionId: number;

    constructor(promotionId: number) {
        this.promotionId = promotionId;
    }
    // Function to calculate the discount for the items in the cart.
    //If the seller of the items in the Cart is the same (excluding VasItems),
    // SameSellerPromotion is applied to the Cart, and a 10% discount is applied to the total amount of the Cart.
    // Returns the discount.
    calculateDiscount(items: Item[], totalPrice: number): number {
        let discount = 0;
        let sellerId = items[0]?.sellerId;
        let sameSeller = true;
        items.forEach(item => {
            if (item.sellerId !== sellerId) {
                sameSeller = false;
            }
        });
        if (sameSeller) {
            discount = totalPrice * 0.1;
        }
        return discount;
    }
}