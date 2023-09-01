import CartService from "../src/services/CartService";
import DefaultItem from "../src/models/Items/DefaultItem";

describe('Success Cases', () => {
    test('remove item with 1 quantity success', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        cartService.addItem(payload);
        cartService.removeItem(payload.itemId);
        const items = cartService.getItems();
        expect(items.length).toBe(0);
    });
    test('remove item with more than 1 quantity success', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 2
        };
        cartService.addItem(payload);
        cartService.removeItem(payload.itemId);
        const items = cartService.getItems();
        expect(items.length).toBe(1);
        expect(items[0]).toBeInstanceOf(DefaultItem);
        expect(items[0].itemId).toBe(1);
        expect(items[0].categoryId).toBe(1);
        expect(items[0].sellerId).toBe(1);
        expect(items[0].price).toBe(100);
        expect(items[0].quantity).toBe(1);
    });
    test('remove vas item with 1 quantity success', () => {
        const cartService = new CartService();
        const defaultItemPayload = {
            itemId: 1,
            categoryId: 1001,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        const vasItemPayload = {
            itemId: 1,
            categoryId: 3242,
            sellerId: 5003,
            price: 100,
            quantity: 1,
            vasItemId: 2
        };
        cartService.addItem(defaultItemPayload);
        cartService.addVasItem(vasItemPayload);
        cartService.removeItem(vasItemPayload.vasItemId);
        const items = cartService.getItems();
        const vasItems = (<DefaultItem> items[0]).vasItems;
        expect(vasItems.length).toBe(0);
    });
    test('remove vas item with more than 1 quantity success', () => {
        const cartService = new CartService();
        const defaultItemPayload = {
            itemId: 1,
            categoryId: 1001,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        const vasItemPayload = {
            itemId: 1,
            categoryId: 3242,
            sellerId: 5003,
            price: 100,
            quantity: 2,
            vasItemId: 2
        };
        cartService.addItem(defaultItemPayload);
        cartService.addVasItem(vasItemPayload);
        cartService.removeItem(vasItemPayload.vasItemId);
        const items = cartService.getItems();
        const vasItems = (<DefaultItem> items[0]).vasItems;
        expect(vasItems[0].quantity).toBe(1);
    });
});
describe('Fail Cases', () => {
    test('remove item with invalid item id fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        cartService.addItem(payload);
        expect(() => cartService.removeItem(2)).toThrowError('Item not found');
    });
});