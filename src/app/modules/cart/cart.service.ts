import {  CartItem } from "@prisma/client";
import prisma from "../../config/prisma";

const addToCart = async (payload: any) => {
  const { customerId } = payload;
  const isExist = await prisma.cart.findFirst({
    where: {
      customerId,
    },
  });
  if (isExist) {
    payload.cartId = isExist?.id;
  }
  if (!isExist) {
    const cartItem = await prisma.cart.create({
      data: {
        customerId,
      },
    });
    payload.cartId = cartItem.id;
  }
  const cart = await prisma.cartItem.create({
    data: payload,
  });
  return cart;
};

const getCartItems = async (customerId: string) => {
  const carts = await prisma.cart.findFirst({
    where: {
      customerId,
    },
  });
  return carts;
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
