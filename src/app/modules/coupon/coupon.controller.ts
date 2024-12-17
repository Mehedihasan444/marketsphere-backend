import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IAuthUser } from "../user/user.constant";
import { CouponServices } from "./coupon.services";
import httpStatus from "http-status";
const createCoupon = catchAsync(async (req, res) => {
  const coupon = await CouponServices.createCoupon(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon created Successfully",
    data: coupon,
  });
});
const applyCoupon = catchAsync(async (req, res) => {
  const coupon = await CouponServices.applyCoupon(req.body, req?.user as IAuthUser);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon applied Successfully",
    data: coupon,
  });
});
const getAllCoupons = catchAsync(async (req, res) => {
  const coupon = await CouponServices.getAllCoupons(req?.user as IAuthUser);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupons retrieved Successfully",
    data: coupon,
  });
});
const getSingleShopCoupons = catchAsync(async (req, res) => {
  const id = req.params.id;
  const coupon = await CouponServices.getSingleShopCoupons(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupons retrieved Successfully",
    data: coupon,
  });
});
const deleteCoupon = catchAsync(async (req, res) => {
  const coupon = await CouponServices.deleteCoupon(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon deleted Successfully",
    data: coupon,
  });
});
const updateCoupon = catchAsync(async (req, res) => {
  const coupon = await CouponServices.updateCoupon(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon updated Successfully",
    data: coupon,
  });
});

export const CouponControllers = {
  createCoupon,
  getAllCoupons,
  getSingleShopCoupons,
  deleteCoupon,
  updateCoupon,
  applyCoupon
};
