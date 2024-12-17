import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { Role } from "@prisma/client";
import { CouponControllers } from "./coupon.controller";
import { CouponValidationSchema } from "./coupon.validation";
const router = express.Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.VENDOR),
  validateRequest(CouponValidationSchema.createCouponSchema),
  CouponControllers.createCoupon
);
router.post(
  "/apply",
  auth(Role.CUSTOMER),
  CouponControllers.applyCoupon
);
router.get("/", auth(Role.VENDOR, Role.ADMIN, Role.SUPER_ADMIN), CouponControllers.getAllCoupons);
router.get(
  "/:id",
  CouponControllers.getSingleShopCoupons
);
router.patch(
  "/:id",
  auth(Role.ADMIN, Role.VENDOR),
  validateRequest(CouponValidationSchema.updateCouponSchema),
  CouponControllers.updateCoupon
);
router.delete(
  "/:id",
  auth(Role.ADMIN, Role.VENDOR),
  CouponControllers.deleteCoupon
);

export const CouponRoutes = router;
