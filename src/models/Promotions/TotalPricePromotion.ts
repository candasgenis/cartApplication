import Promotion from "./Promotion";
import Item from "../Items/Item";

export default class TotalPricePromotion implements Promotion{
    promotionId: number;

    constructor(promotionId: number) {
        this.promotionId = promotionId;
    }
    // Function to calculate the discount for the items in the cart.
    // If the price of the cart is less than 5,000 TL (excluding 5,000), a discount of 250 TL is applied.
    // If the price is between 5,000 TL and 10,000 TL (excluding 10,000), a discount of 500 TL is applied.
    // If the price is between 10,000 TL and 50,000 TL (excluding 50,000), a discount of 1,000 TL is applied.
    // If the price is 50,000 TL or above, a discount of 2,000 TL is applied.
    // Returns the discount.
    calculateDiscount(items: Item[], totalPrice: number): number {
        let discount: number;
        if (totalPrice < 5000) {
            discount = 250;
        } else if (totalPrice < 10000) {
            discount = 500;
        } else if (totalPrice < 50000) {
            discount = 1000;
        } else {
            discount = 2000;
        }
        return discount;
    }
}