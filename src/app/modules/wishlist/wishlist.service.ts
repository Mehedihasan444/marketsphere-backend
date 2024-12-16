import { WishlistItem, Role } from "@prisma/client";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

// Add to wishlist
const addToWishlist = async (payload: any) => {
  const customer = await prisma.customer.findFirstOrThrow({
    where: {
      email: payload.email,
    },
  });
  const customerId = customer.id;
  const getWishlist = await prisma.wishlist.findFirstOrThrow({
    where: {
      customerId,
    },
  });

  const info = {
    productId: payload.productId,
    wishlistId: getWishlist.id,
    quantity: payload?.quantity || 1,
  };

  const isExist = await prisma.wishlistItem.findFirst({
    where: {
      productId: payload.productId,
      wishlistId: getWishlist.id,
    },
  })
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product already in wishlist");
  }

  const wishlist = await prisma.wishlistItem.create({
    data: info,
  });
  return wishlist;
};

const getWishlistItems = async (email: string) => {


  const customer = await prisma.customer.findFirstOrThrow({
    where: {
      email,
    },
  });
  const wishlists = await prisma.wishlist.findFirst({
    where: {
      customerId: customer.id,
    },
    include: {
      WishlistItem: { include: { product: true } },
    },
  });
  return wishlists?.WishlistItem;
};

const updateWishlistItem = async (
  wishlistItemId: string,
  payload: Partial<WishlistItem>
) => {
  await prisma.wishlistItem.findUniqueOrThrow({ where: { id: wishlistItemId } });

  const result = await prisma.wishlistItem.update({
    where: { id: wishlistItemId },
    data: payload,
  });
  return result;
};
const removeWishlistItem = async (wishlistItemId: string) => {

  await prisma.wishlistItem.findUniqueOrThrow({ where: { id: wishlistItemId } });

  const result = await prisma.wishlistItem.delete({
    where: {
      id: wishlistItemId,
    },
  });
  return result;
};

const clearWishlist = async (wishlistId: string) => {
  await prisma.wishlistItem.findFirstOrThrow({ where: { wishlistId } });
  await prisma.wishlistItem.deleteMany({
    where: {
      wishlistId,
    },
  });
};

export const WishlistServices = {
  addToWishlist,
  getWishlistItems,
  removeWishlistItem,
  updateWishlistItem,
  clearWishlist,
};
