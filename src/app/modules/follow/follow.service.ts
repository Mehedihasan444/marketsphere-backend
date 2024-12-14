import { Follow } from "@prisma/client";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const followShop = async (payload: Omit<Follow, "id" | "createdAt" | "updatedAt">) => {
  const isExist = await prisma.follow.findUnique({
    where: {
      customerId_shopId: {
        customerId: payload.customerId,
        shopId: payload.shopId,
      },
    },
  });

  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already followed this shop.");
  }

  const result = await prisma.follow.create({
    data: {
      customerId: payload.customerId,
      shopId: payload.shopId,
    },
  });

  return result;
};

const unfollowShop = async (payload: Omit<Follow, "id" | "createdAt" | "updatedAt">) => {
  const isExist = await prisma.follow.findUnique({
    where: {
      customerId_shopId: {
        customerId: payload.customerId,
        shopId: payload.shopId,
      },
    },
  });

  if (!isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not following this shop.");
  }

  const result = await prisma.follow.delete({
    where: {
      customerId_shopId: {
        customerId: payload.customerId,
        shopId: payload.shopId,
      },
    },
  });

  return result;
};


const getFollowedShops = async (userEmail: string) => {
  const result = await prisma.customer.findFirst({
    where: {
      email: userEmail,
    },
    include: {
      follow: true,
    },
  });

  return result?.follow;
};

export const FollowServices = {
  followShop,
  unfollowShop,
  getFollowedShops,
};
