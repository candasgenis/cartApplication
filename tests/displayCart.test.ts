import CartService from "../src/services/CartService";

describe('Success Cases', () => {
    test('display cart success', () => {
        const cartService = new CartService();
        const payload = {
            itemId: 1,
            categoryId: 1,
            sellerId: 1,
            price: 100,
            quantity: 1
        };
        cartService.addItem(payload);
        const cartContent = JSON.parse(cartService.getCartContent());
        cartContent.items[0].quantity = 1;
        expect(cartContent).toEqual({
            items: [
                {
                    itemId: 1,
                    categoryId: 1,
                    sellerId: 1,
                    price: 100,
                    quantity: 1,
                    vasItems: []
                }
            ],
            totalPrice: 0,
            appliedPromotionId: 1232,
            totalDiscount: 250
        });
    });
    test('display cart success with vas item', () => {
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
        const cartContent = JSON.parse(cartService.getCartContent());
        cartContent.items[0].quantity = 1;
        expect(cartContent).toEqual({
            items: [
                {
                    itemId: 1,
                    categoryId: 1001,
                    sellerId: 1,
                    price: 100,
                    quantity: 1,
                    vasItems: [
                        {
                            itemId: 2,
                            categoryId: 3242,
                            sellerId: 5003,
                            price: 100,
                            quantity: 1
                        }
                    ]
                }
            ],
            totalPrice: 0,
            appliedPromotionId: 1232,
            totalDiscount: 250
        });
    });
    test('display cart success with digital item', () => {
        const cartService = new CartService();
        const digitalItemPayload = {
            itemId: 1,
            categoryId: 7889,
            sellerId: 1,
            price: 100,
            quantity: 1,
        };
        cartService.addItem(digitalItemPayload);
        const cartContent = JSON.parse(cartService.getCartContent());
        cartContent.items[0].quantity = 1;
        expect(cartContent).toEqual({
            items: [
                {
                    itemId: 1,
                    categoryId: 7889,
                    sellerId: 1,
                    price: 100,
                    quantity: 1,
                }],
            totalPrice: 0,
            appliedPromotionId: 1232,
            totalDiscount: 250
        });
    });
});