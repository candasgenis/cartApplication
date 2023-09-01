import Cart from '../models/Cart';
import ItemCreator from '../models/Items/ItemCreator';
import Item from "../models/Items/Item";

class CartService {
    private cart: Cart;

    constructor() {
        this.cart = new Cart();
    }

    // Add an item to the cart
    addItem(payload: any): void {
        try {
            const specifiedItem = ItemCreator.specifyItem(payload.itemId, payload.categoryId, payload.sellerId, payload.price, payload.quantity)
            this.cart.addItem(specifiedItem);
        } catch (error) {
            throw error;
        }
    }

    addVasItem(payload: any) {
        try {
            const specifiedItem = ItemCreator.specifyItem(payload.itemId, payload.categoryId, payload.sellerId,
                payload.price, payload.quantity, payload.vasItemId);
            this.cart.addVasItem(specifiedItem);
        } catch (error) {
            throw error;
        }
    }

    // Remove an item from the cart
    removeItem(itemId: number): void {
        try {
            this.cart.removeItem(itemId);
        } catch (error) {
            throw error;
        }
    }

    // Reset the cart (empty all items)
    reset(): void {
        try {
            this.cart.reset();
        } catch (error) {
            throw error;
        }
    }

    // Get the current items in the cart
    getItems(): Item[] {
        try {
            return this.cart.items;
        } catch (error) {
            throw error;
        }
    }

    getCartContent(): any {
        try {
            return this.cart.getCartContent();
        } catch (error) {
            throw error;
        }
    }
}

export default CartService;