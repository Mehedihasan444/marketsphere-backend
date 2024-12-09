import { Follow } from "@prisma/client";
import prisma from "../../config/prisma";

const followShop = async (payload: Follow) => {
  const result = await prisma.follow.create({
    data: payload,
  });
  return result;
};
const unfollowShop = async (payload: Follow) => {
  const result = await prisma.follow.delete({
    where: {
      id: `${payload.customerId}_${payload.shopId}`,
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
