"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidationSchema = void 0;
const zod_1 = require("zod");
const createReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z
            .string({
            required_error: "Customer Id is required",
        })
            .uuid(),
        reviewId: zod_1.z
            .string({
            required_error: "Review Id is required",
        })
            .uuid(),
        orderId: zod_1.z
            .string({
            required_error: "Order Id is required",
        })
            .uuid(),
        rating: zod_1.z
            .number({
            required_error: "Rating is required",
        })
            .min(1)
            .max(5),
        comment: zod_1.z
            .string({
            required_error: "Comment is required",
        })
            .min(1)
            .max(255),
    }),
});
const updateReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z
            .string({
            required_error: "Customer Id is required",
        })
            .uuid()
            .optional(),
        productId: zod_1.z
            .string({
            required_error: "Product Id is required",
        })
            .uuid()
            .optional(),
        shopId: zod_1.z
            .string({
            required_error: "Shop Id is required",
        })
            .uuid()
            .optional(),
        rating: zod_1.z
            .number({
            required_error: "Rating is required",
        })
            .min(1)
            .max(5)
            .optional(),
        comment: zod_1.z
            .string({
            required_error: "Comment is required",
        })
            .optional(),
    }),
});
exports.reviewValidationSchema = {
    createReviewValidationSchema,
    updateReviewValidationSchema,
};
