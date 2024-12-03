"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartValidationSchema = void 0;
const zod_1 = require("zod");
const addToCartSchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid(),
    cartItems: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().uuid(),
        quantity: zod_1.z.number().int().positive(),
    })),
});
const updateCartSchema = zod_1.z.object({
    cartId: zod_1.z.string().uuid(),
    cartItems: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().uuid(),
        quantity: zod_1.z.number().int().positive(),
    })),
});
const removeCartSchema = zod_1.z.object({
    cartId: zod_1.z.string().uuid(),
    cartItemId: zod_1.z.string().uuid(),
});
exports.cartValidationSchema = {
    addCartValidationSchema: addToCartSchema,
    removeCartValidationSchema: removeCartSchema,
    updateCartValidationSchema: updateCartSchema,
};
