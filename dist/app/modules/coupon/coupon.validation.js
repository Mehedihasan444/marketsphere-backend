"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponValidationSchema = void 0;
const zod_1 = require("zod");
const createCouponSchema = zod_1.z.object({
    body: zod_1.z.object({
        shopId: zod_1.z
            .string({
            required_error: "Shop ID is required",
        }),
        couponId: zod_1.z
            .string({
            required_error: "Coupon ID is required",
        })
            .optional(),
        orderId: zod_1.z.string().min(1, "Order ID is required").optional(),
        code: zod_1.z.string({
            required_error: "Code is required",
        }).min(1, "Code is required"),
        discount: zod_1.z.number({
            required_error: "Discount is required",
        }).min(0, "Discount must be a positive number"),
        expiryDate: zod_1.z.date({
            required_error: "Expiry date is required",
        }),
    }),
});
const updateCouponSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string().min(1, "Code is required").optional(),
        discount: zod_1.z
            .number()
            .min(0, "Discount must be a positive number")
            .optional(),
        expiryDate: zod_1.z.date().optional(),
        orderId: zod_1.z.string().min(1, "Order ID is required").optional(),
        shopId: zod_1.z.string().optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
exports.CouponValidationSchema = {
    createCouponSchema,
    updateCouponSchema,
};
