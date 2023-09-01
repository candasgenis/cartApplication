import CartService from "../src/services/CartService";
import DefaultItem from "../src/models/Items/DefaultItem";
import VasItem from "../src/models/Items/VasItem";

const vasItemPayload = {
    itemId: 1,
    categoryId: 3242,
    sellerId: 5003,
    price: 100,
    quantity: 1,
    vasItemId: 2
};
const defaultItemPayload = {
    itemId: 1,
    categoryId: 1001,
    sellerId: 1,
    price: 100,
    quantity: 1
};

describe('Success Cases', () => {
    test('add vas item success', () => {
        const cartService = new CartService();

        cartService.addItem(defaultItemPayload);
        cartService.addVasItem(vasItemPayload);

        const items = cartService.getItems();
        const vasItems = (<DefaultItem>items[0]).vasItems;

        expect(vasItems.length).toBe(1);
        expect(vasItems[0]).toBeInstanceOf(VasItem);
        expect(vasItems[0].itemId).toBe(2);
        expect(vasItems[0].categoryId).toBe(3242);
        expect(vasItems[0].sellerId).toBe(5003);
        expect(vasItems[0].price).toBe(100);
        expect(vasItems[0].quantity).toBe(1);
    });
    test('add vas item quantity more than 1 success', () => {
        const cartService = new CartService();

        cartService.addItem(defaultItemPayload);
        cartService.addVasItem({
            ...vasItemPayload,
            quantity: 2
        });

        const items = cartService.getItems();
        const vasItems = (<DefaultItem>items[0]).vasItems;

        expect(vasItems.length).toBe(1);
        expect(vasItems[0]).toBeInstanceOf(VasItem);
        expect(vasItems[0].itemId).toBe(2);
        expect(vasItems[0].categoryId).toBe(3242);
        expect(vasItems[0].sellerId).toBe(5003);
        expect(vasItems[0].price).toBe(100);
        expect(vasItems[0].quantity).toBe(2);
    });
});

describe('Fail Cases', () => {
    test('add vas item when there is no default item on the cart fail', () => {
        const cartService = new CartService();

        expect(() => {
            cartService.addVasItem(vasItemPayload);
        }).toThrowError('There is no default item in cart with this itemId!');
    });
    test('add vas item with quantity more than 3 fail', () => {
        const cartService = new CartService();

        cartService.addItem(defaultItemPayload);

        expect(() => {
            cartService.addVasItem({
                ...vasItemPayload,
                quantity: 4
            });
        }).toThrowError('Vas item quantity cannot exceed 3!');
    });
    test('add vas item with quantity less than 1 fail', () => {
        const cartService = new CartService();

        cartService.addItem(defaultItemPayload);

        expect(() => {
            cartService.addVasItem({
                ...vasItemPayload,
                quantity: 0
            });
        }).toThrowError('Item quantity must be greater than 0!');
    });
    test('add vas item with negative quantity fail', () => {
        const cartService = new CartService();

        cartService.addItem(defaultItemPayload);

        expect(() => {
            cartService.addVasItem({
                ...vasItemPayload,
                quantity: -1
            });
        }).toThrowError('Item quantity must be greater than 0!');
    });
    test('add vas item more than 3 unique vas item fail', () => {
        const cartService = new CartService();
        cartService.addItem(defaultItemPayload);
        cartService.addVasItem(vasItemPayload);
        cartService.addVasItem({
            ...vasItemPayload,
            vasItemId: 3
        });
        cartService.addVasItem({
            ...vasItemPayload,
            vasItemId: 4
        });

        expect(() => {
            cartService.addVasItem({
                ...vasItemPayload,
                vasItemId: 5
            });
        }).toThrowError('Vas item quantity cannot exceed 3!');
    });
    test('add vas item with price more than the default item price fail', () => {
        const cartService = new CartService();

        cartService.addItem(defaultItemPayload);

        expect(() => {
            cartService.addVasItem({
                ...vasItemPayload,
                price: 101
            });
        }).toThrowError('Vas item price cannot exceed default item price!');
    });
    test('add vas item to digital item fail', () => {
        const cartService = new CartService();

        cartService.addItem({
            ...defaultItemPayload,
            categoryId: 7889
        });

        expect(() => {
            cartService.addVasItem(vasItemPayload);
        }).toThrowError('There is no default item in cart with this itemId!');
    });
    test('add vas item to default item with category id other than 1001 or 3004 fail', () => {
        const cartService = new CartService();

        cartService.addItem({
            ...defaultItemPayload,
            categoryId: 1000
        });

        expect(() => {
            cartService.addVasItem(vasItemPayload);
        }).toThrowError('Vas item cannot be added to this item!(Check category id of default item)');
    });
    test('add vas item with category id 7889 fail', () => {
        const cartService = new CartService();

        cartService.addItem(defaultItemPayload);

        expect(() => {
            cartService.addVasItem({
                ...vasItemPayload,
                categoryId: 7889
            });
        }).toThrowError('Invalid item!');
    });
    test('add vas item total price hits more than 500000 fail', () => {
        const cartService = new CartService();

        cartService.addItem({
            ...defaultItemPayload,
            price: 500000
        });

        expect(() => {
            cartService.addVasItem({
                ...vasItemPayload,
                price: 1
            });
        }).toThrowError('Total price of items in the cart cannot exceed 500000!');
    });
    test('add vas item with seller id other than 5003', () => {
        const cartService = new CartService();

        cartService.addItem(defaultItemPayload);

        expect(() => {
            cartService.addVasItem({
                ...vasItemPayload,
                sellerId: 5004
            });
        }).toThrowError('Invalid seller id for VasItem!');
    });
});