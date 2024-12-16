import { CartItem, Role } from "@prisma/client";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

// Add to cart
// const addToCart = async (payload: any) => {
//   const customer = await prisma.customer.findFirstOrThrow({
//     where: {
//       email: payload.email,
//     },
//   });
//   const customerId = customer.id;
//   const getCart = await prisma.cart.findFirstOrThrow({
//     where: {
//       customerId,
//     },
//   });

//   const info = {
//     productId: payload.productId,
//     cartId: getCart.id,
//     quantity: payload?.quantity || 1,
//   };

//   const isExist = await prisma.cartItem.findFirst({
//     where: {
//       productId: payload.productId,
//       cartId: getCart.id,
//     },
//   })
//   if (isExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Product already in cart");
//   }

//   const cart = await prisma.cartItem.create({
//     data: info,
//   });
//   return cart;
// };
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

  const isExist = await prisma.cartItem.findFirst({
    where: {
      productId: payload.productId,
      cartId: getCart.id,
    },
  })
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product already in cart");
  }
  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: payload.productId,
    },
  })
  const shop = await prisma.shop.findFirstOrThrow({
    where: {
      id: product.shopId,
    },
  })
  const checkCartItemsVendorSameOrNot = await prisma.cartItem.findFirst({
    where: {
      cartId: getCart.id,
    },
    include: {
      product: {
        include: {
          shop: true,
        },
      },
    },
  });
  if (checkCartItemsVendorSameOrNot) {
    if (checkCartItemsVendorSameOrNot.product.shop.vendorId !== shop.vendorId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You can't add products from different vendors in the same cart."
      );
    }
  }

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
  await prisma.cartItem.findFirstOrThrow({ where: { cartId } });
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
