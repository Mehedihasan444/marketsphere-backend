"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidationSchema = void 0;
const zod_1 = require("zod");
const createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string(),
        quantity: zod_1.z.number().int().positive(),
        totalAmount: zod_1.z.number().positive(),
        orderNumber: zod_1.z.string().optional(), // This will be generated in the service
        status: zod_1.z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
        isDeleted: zod_1.z.boolean().optional(),
        orderItems: zod_1.z
            .array(zod_1.z.object({
        // Define the structure of order items here
        }))
            .optional(),
        coupons: zod_1.z
            .array(zod_1.z.object({
        // Define the structure of coupons here
        }))
            .optional(),
    }),
});
const updateOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().optional(),
        quantity: zod_1.z.number().int().positive().optional(),
        totalAmount: zod_1.z.number().positive().optional(),
        orderNumber: zod_1.z.string().optional(), // This should not be updated
        status: zod_1.z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
        isDeleted: zod_1.z.boolean().optional(),
        orderItems: zod_1.z
            .array(zod_1.z.object({
        // Define the structure of order items here
        }))
            .optional(),
        coupons: zod_1.z
            .array(zod_1.z.object({
        // Define the structure of coupons here
        }))
            .optional(),
    }),
});
exports.orderValidationSchema = {
    createOrderValidationSchema: createOrderSchema,
    updateOrderValidationSchema: updateOrderSchema,
};
