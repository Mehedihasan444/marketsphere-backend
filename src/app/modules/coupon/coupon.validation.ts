import { z } from "zod";

const createCouponSchema = z.object({
  body: z.object({
    shopId: z
      .string({
        required_error: "Shop ID is required",
      }),
    couponId: z
      .string({
        required_error: "Coupon ID is required",
      })
      .optional(),
    orderId: z.string().min(1, "Order ID is required").optional(),
    code: z.string({
        required_error: "Code is required",
    }).min(1, "Code is required"),
    discount: z.number({
        required_error: "Discount is required",
    }).min(0, "Discount must be a positive number"),
    expiryDate: z.date({
        required_error: "Expiry date is required",
    }),
  }),
});

const updateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, "Code is required").optional(),
    discount: z
      .number()
      .min(0, "Discount must be a positive number")
      .optional(),
    expiryDate: z.date().optional(),
    orderId: z.string().min(1, "Order ID is required").optional(),
    shopId: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const CouponValidationSchema = {
  createCouponSchema,
  updateCouponSchema,
};
