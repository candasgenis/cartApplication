import CartService from "../src/services/CartService";
import DefaultItem from "../src/models/Items/DefaultItem";
import DigitalItem from "../src/models/Items/DigitalItem";

describe('Success Cases', () => {
    test('add digital item success', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 7889,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        cartService.addItem(payload);
        const items = cartService.getItems();
        expect(items.length).toBe(1);
        expect(items[0]).toBeInstanceOf(DigitalItem);
        expect(items[0].itemId).toBe(1);
        expect(items[0].categoryId).toBe(7889);
        expect(items[0].sellerId).toBe(1);
        expect(items[0].price).toBe(100);
        expect(items[0].quantity).toBe(1);
    });
    test('add digital item quantity more than 1 success', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 7889,
            sellerId: 1,
            price: 100,
            quantity: 2
        };
        cartService.addItem(payload);
        const items = cartService.getItems();
        expect(items.length).toBe(1);
        expect(items[0]).toBeInstanceOf(DigitalItem);
        expect(items[0].itemId).toBe(1);
        expect(items[0].categoryId).toBe(7889);
        expect(items[0].sellerId).toBe(1);
        expect(items[0].price).toBe(100);
        expect(items[0].quantity).toBe(2);
    });
    test('add default item success', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        cartService.addItem(payload);
        const items = cartService.getItems();
        expect(items.length).toBe(1);
        expect(items[0]).toBeInstanceOf(DefaultItem);
        expect(items[0].itemId).toBe(1);
        expect(items[0].categoryId).toBe(1);
        expect(items[0].sellerId).toBe(1);
        expect(items[0].price).toBe(100);
        expect(items[0].quantity).toBe(1);
    });
    test('add default item quantity more than 1 success', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 2
        };
        cartService.addItem(payload);
        const items = cartService.getItems();
        expect(items.length).toBe(1);
        expect(items[0]).toBeInstanceOf(DefaultItem);
        expect(items[0].itemId).toBe(1);
        expect(items[0].categoryId).toBe(1);
        expect(items[0].sellerId).toBe(1);
        expect(items[0].price).toBe(100);
        expect(items[0].quantity).toBe(2);
    });
});

describe('Fail Cases', () => {
    test('add item with negative quantity fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: -1
        };
        expect(() => cartService.addItem(payload)).toThrowError('Item quantity must be greater than 0!');
    });
    test('add item with zero quantity fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 0
        };
        expect(() => cartService.addItem(payload)).toThrowError('Item quantity must be greater than 0!');
    });
    test('add item with negative price fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: -100,
            quantity: 1
        };
        expect(() => cartService.addItem(payload)).toThrowError('Item price must be greater than 0!');
    });
    test('add item with zero price fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 0,
            quantity: 1
        };
        expect(() => cartService.addItem(payload)).toThrowError('Item price must be greater than 0!');
    });
    test('add digital item to a cart that contains default item fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        cartService.addItem(payload);
        const payload2 = {
            itemId: 2,
            categoryId: 7889,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        expect(() => cartService.addItem(payload2)).toThrowError('Digital Items can only be added with digital items!');
    });
    test('add default item to a cart that contains digital item fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 7889,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        cartService.addItem(payload);
        const payload2 = {
            itemId: 2,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        expect(() => cartService.addItem(payload2)).toThrowError('You cannot add default item to this cart because there are digital item(s) inside!');
    });
    test('add more than 10 unique items to cart fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        for (let i = 0; i < 10; i++) {
            payload.itemId = i;
            cartService.addItem(payload);
        }
        payload.itemId = 11;
        expect(() => cartService.addItem(payload)).toThrowError('Your cart is full!');
    });
    test('add default item more than 10 quantity fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 11
        };
        cartService.addItem(payload);
        expect(() => cartService.addItem(payload)).toThrowError('Exceeded max quantity of items in the cart! ' +
            '(For digital items, max quantity is 5. For default items, max quantity is 10.)');
    });
    test('add digital item more than 5 quantity fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 7889,
            sellerId: 1,
            price: 100,
            quantity: 6
        };
        cartService.addItem(payload);
        expect(() => cartService.addItem(payload)).toThrowError('Exceeded max quantity of items in the cart! ' +
            '(For digital items, max quantity is 5. For default items, max quantity is 10.)');
    });
    test('add more than 30 quantity of items to cart fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 7889,
            sellerId: 1,
            price: 100,
            quantity: 10
        };
        for (let i = 0; i < 3; i++) {
            payload.itemId = i;
            cartService.addItem(payload);
        }
        payload.itemId = 4;
        expect(() => cartService.addItem(payload)).toThrowError('Total quantity of items in the cart cannot exceed 30!');
    });
    test('add existing item with wrong info fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 7889,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        cartService.addItem(payload);
        payload.sellerId = 2;
        expect(() => cartService.addItem(payload)).toThrowError('Item to be added is not the same as the existing item!(Check the given item info)');
    });
    test('add item total price hits more than 500000 fail', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 7889,
            sellerId: 1,
            price: 50000,
            quantity: 10
        };
        cartService.addItem(payload);
        expect(() => cartService.addItem(payload)).toThrowError('Total price of items in the cart cannot exceed 500000!');
    });
});