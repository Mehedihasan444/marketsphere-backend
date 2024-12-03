import { z } from "zod";

const addToCartSchema = z.object({
  customerId: z.string().uuid(),
  cartItems: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ),
});
const updateCartSchema = z.object({
    cartId: z.string().uuid(),
    cartItems: z.array(
        z.object({
            productId: z.string().uuid(),
            quantity: z.number().int().positive(),
        })
    ),
});

const removeCartSchema = z.object({
  cartId: z.string().uuid(),
  cartItemId: z.string().uuid(),
});

export const cartValidationSchema = {
  addCartValidationSchema: addToCartSchema,
  removeCartValidationSchema: removeCartSchema,
    updateCartValidationSchema: updateCartSchema,
};
