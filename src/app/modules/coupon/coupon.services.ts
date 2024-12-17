import { Coupon, CouponItem } from "@prisma/client";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IAuthUser } from "../user/user.constant";
//  Create a coupon
const createCoupon = async (payload: CouponItem & Coupon) => {
  const { shopId, ...CouponInfo } = payload

  const checkShopCoupon = await prisma.coupon.findFirst({
    where: {
      shopId: shopId,
    },
  });
  if (!checkShopCoupon) {
    await prisma.coupon.create({
      data: {
        shopId: shopId,
      },
    });
  }
  const coupon = await prisma.coupon.findFirstOrThrow({
    where: {
      shopId: shopId,
    },
  })
  CouponInfo.couponId = coupon.id;
  CouponInfo.expiryDate = new Date(CouponInfo.expiryDate);
  const result = await prisma.couponItem.create({ data: CouponInfo });
  return result;
};
//  Apply coupon to a user
const applyCoupon = async (payload: { code: string, shopId: string }, user: IAuthUser) => {
  const { code, shopId } = payload
  const isExist = await prisma.couponItem.findFirst({
    where: {
      code: code,
    },
  });

  if (!isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid coupon code");
  }
  if (isExist.expiryDate < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon has expired");
  }


  // Check if user is eligible for coupon


  const shop = await prisma.shop.findFirstOrThrow({
    where: {
      id: shopId,
    }, include: {
      coupon: {
        include: {
          couponItem: true
        }
      }
    }
  })

  const coupon = shop?.coupon[0]?.couponItem?.find((coupon: CouponItem) => (coupon.code === code && coupon.expiryDate > new Date()))

  if (!coupon) {
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon is not valid for this shop");
  }

  //  Check if coupon is already used
  const customer = await prisma.customer.findFirstOrThrow({
    where: {
      email: user?.email
    },

  })
  const order = await prisma.order.findFirst({
    where: {
      customerId: customer.id,
      appliedCoupon: code
    }
  })
  if (order) {
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon is already used");
  }
  return {
    coupon: true,
    discount: coupon.discount,
  };
};
//  Get all coupons
const getAllCoupons = async (user: IAuthUser) => {
  const vendor = await prisma.vendor.findFirstOrThrow({
    where: { email: user?.email },
    include: { shop: true }
  });

  // Extract shop IDs from the vendor's shops
  const shopIds = vendor.shop?.map((shop) => shop.id) || [];

  // If no shops are associated with the vendor, return an empty array
  if (shopIds.length === 0) {
    return [];
  }

  // Find all coupons linked to the vendor's shops
  const coupons = await prisma.coupon.findMany({
    where: { shopId: { in: shopIds } },
    include: {
      couponItem: {
        include: {
          coupon: true
        }
      }
    }
  });
  return coupons;
};
//  Get all coupons of a shop
const getSingleShopCoupons = async (shopId: string) => {
  const coupon = await prisma.coupon.findFirst(
    {
      where: { shopId },
      include: {
        couponItem: true
      }
    });
  return coupon;
};
//  Delete a coupon
const deleteCoupon = async (id: string) => {
  const coupon = await prisma.couponItem.delete({ where: { id } });
  return coupon;
};
//  Update a coupon
const updateCoupon = async (id: string, payload: CouponItem & { shopId: string }) => {
  const { shopId, ...updateInfo } = payload
  updateInfo.expiryDate = new Date(payload.expiryDate);
  await prisma.couponItem.findFirstOrThrow({ where: { id } });
  const coupon = await prisma.couponItem.update({
    where: { id },
    data: updateInfo,
  });
  return coupon;
};

export const CouponServices = {
  createCoupon,
  getAllCoupons,
  getSingleShopCoupons,
  deleteCoupon,
  updateCoupon,
  applyCoupon,
};
