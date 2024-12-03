"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowValidationSchema = void 0;
const zod_1 = require("zod");
const followValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z
            .string({
            required_error: "Customer Id is required",
        })
            .uuid(),
        shopId: zod_1.z
            .string({
            required_error: "Shop Id is required",
        })
            .uuid(),
    }),
});
const unfollowValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z
            .string({
            required_error: "Customer Id is required",
        })
            .uuid(),
        shopId: zod_1.z
            .string({
            required_error: "Shop Id is required",
        })
            .uuid(),
    }),
});
exports.FollowValidationSchema = {
    followValidationSchema,
    unfollowValidationSchema,
};
