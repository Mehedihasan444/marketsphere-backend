import { Coupon, CouponItem } from "@prisma/client";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
//  Create a coupon
const createCoupon = async (payload: CouponItem & Coupon) => {
  const checkShopCoupon = await prisma.coupon.findFirst({
    where: {
      shopId: payload.shopId,
    },
  });
  if (!checkShopCoupon) {
    await prisma.coupon.create({
      data: {
        shopId: payload.shopId,
      },
    });
  }

  const coupon = await prisma.couponItem.create({ data: payload });
  return coupon;
};
//  Apply coupon to a user
const applyCoupon = async (payload: CouponItem) => {
  const isExist = await prisma.couponItem.findFirst({
    where: {
      code: payload.code,
      couponId: payload.couponId,
      discount: payload.discount,
    },
  });


  if (!isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid coupon code");
  }
  if (isExist.expiryDate < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon has expired");
  }

  return true;
};
//  Get all coupons
const getAllCoupons = async () => {
  const coupon = await prisma.coupon.findMany();
  return coupon;
};
//  Get all coupons of a shop
const getSingleShopCoupons = async (shopId: string) => {
  const coupon = await prisma.coupon.findMany({ where: { shopId } });
  return coupon;
};
//  Delete a coupon
const deleteCoupon = async (id: string) => {
  const coupon = await prisma.couponItem.delete({ where: { id } });
  return coupon;
};
//  Update a coupon
const updateCoupon = async (id: string, payload: Partial<Coupon>) => {
  await prisma.couponItem.findUniqueOrThrow({ where: { id } });
  const coupon = await prisma.couponItem.update({
    where: { id },
    data: { ...payload },
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
