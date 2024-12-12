import { CartItem } from "@prisma/client";
import prisma from "../../config/prisma";

const addToCart = async (payload: any) => {
  const customer = await prisma.customer.findFirstOrThrow({
    where: {
      email: payload.email,
    },
  });
  const customerId = customer.id;
  const getCart = await prisma.cart.findFirstOrThrow({
    where: {
      customerId,
    },
  });

  const info = {
    productId: payload.productId,
    cartId: getCart.id,
    quantity: payload?.quantity || 1,
  };

  const cart = await prisma.cartItem.create({
    data: info,
  });
  return cart;
};

const getCartItems = async (email: string) => {
  const customer = await prisma.customer.findFirstOrThrow({
    where: {
      email,
    },
  });
  const carts = await prisma.cart.findFirst({
    where: {
      customerId: customer.id,
    },
    include: {
      cartItems: { include: { product: true } },
    },
  });
  return carts?.cartItems;
};

const updateCartItem = async (
  cartItemId: string,
  payload: Partial<CartItem>
) => {
  await prisma.cartItem.findUniqueOrThrow({ where: { id: cartItemId } });

  const result = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: payload,
  });
  return result;
};
const removeCartItem = async (cartItemId: string) => {

  await prisma.cartItem.findUniqueOrThrow({ where: { id: cartItemId } });

  const result = await prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });
  return result;
};

const clearCart = async (cartId: string) => {
  await prisma.cartItem.findFirstOrThrow({ where: {  cartId } });
  await prisma.cartItem.deleteMany({
    where: {
      cartId,
    },
  });
};

export const CartServices = {
  addToCart,
  getCartItems,
  removeCartItem,
  updateCartItem,
  clearCart,
};
