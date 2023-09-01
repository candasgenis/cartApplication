import Promotion from "./Promotion";
import Item from "../Items/Item";

export default class CategoryPromotion implements Promotion {
    promotionId: number;

    constructor(promotionId: number) {
        this.promotionId = promotionId;
    }
    // Function to calculate the discount for the items in the cart.
    // If the category of the items in the Cart is 3003 (Food),
    // CategoryPromotion is applied to the Cart, and a 5% discount is applied to the total amount of the Cart.
    // Returns the discount.
    calculateDiscount(items: Item[], totalPrice: number): number {
        let discount = 0;
        items.forEach(item => {
            if (item.categoryId === 3003) {
                discount += item.price * item.quantity * 0.05;
            }
        });
        return discount;
    }
}