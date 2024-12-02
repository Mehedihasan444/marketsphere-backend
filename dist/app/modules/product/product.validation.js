"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidationSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
// Validation schema for `Product` creation
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Product name is required."),
    description: zod_1.z.string().min(1, "Product description is required."),
    price: zod_1.z.number().positive("Price must be greater than zero."),
    images: zod_1.z
        .array(zod_1.z.string().url("Each image must be a valid URL."))
        .nonempty("At least one image is required."),
    discount: zod_1.z
        .number()
        .min(0, "Discount must be a non-negative number.")
        .max(100, "Discount cannot exceed 100%."),
    quantity: zod_1.z
        .number()
        .int("Quantity must be an integer.")
        .nonnegative("Quantity cannot be negative."),
    categoryId: zod_1.z.string().uuid("Invalid category ID."),
    shopId: zod_1.z.string().uuid("Invalid shop ID."),
});
// Validation schema for `Product` update
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Product name is required.").optional(),
    description: zod_1.z.string().min(1, "Product description is required.").optional(),
    price: zod_1.z.number().positive("Price must be greater than zero.").optional(),
    images: zod_1.z.array(zod_1.z.string().url("Each image must be a valid URL.")).optional(),
    discount: zod_1.z
        .number()
        .min(0, "Discount must be a non-negative number.")
        .max(100, "Discount cannot exceed 100%.")
        .optional(),
    quantity: zod_1.z
        .number()
        .int("Quantity must be an integer.")
        .nonnegative("Quantity cannot be negative.")
        .optional(),
    categoryId: zod_1.z.string().uuid("Invalid category ID.").optional(),
    shopId: zod_1.z.string().uuid("Invalid shop ID.").optional(),
});
exports.productValidationSchema = {
    createProductValidationSchema: exports.createProductSchema,
    updateProductValidationSchema: exports.updateProductSchema,
};
