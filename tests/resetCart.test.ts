import CartService from "../src/services/CartService";

describe('Success Cases', () => {
    test('reset cart success', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        cartService.addItem(payload);
        cartService.addItem({
            ...payload,
            itemId: 2
        })
        cartService.reset();
        const items = cartService.getItems();
        expect(items.length).toBe(0);
    });
});