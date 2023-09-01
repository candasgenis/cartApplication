import Item from "../Items/Item";

export default interface Promotion {
    promotionId: number;
    calculateDiscount(items: Item[], totalPrice: number): number;
}