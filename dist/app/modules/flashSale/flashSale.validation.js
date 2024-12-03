"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashSaleValidationSchema = void 0;
const zod_1 = require("zod");
const createFlashSaleValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Name is required",
        })
            .nonempty(),
        description: zod_1.z
            .string({
            required_error: "Description is required",
        })
            .nonempty(),
        discount: zod_1.z
            .number({
            required_error: "Discount is required",
        })
            .int(),
        startDateTime: zod_1.z
            .string({
            required_error: "Start Date Time is required",
        })
            .nonempty(),
        endDateTime: zod_1.z
            .string({
            required_error: "End Date Time is required",
        })
            .nonempty(),
        image: zod_1.z
            .string({
            required_error: "Image is required",
        })
            .nonempty(),
    }),
});
const updateFlashSaleValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty().optional(),
        description: zod_1.z.string().nonempty().optional(),
        discount: zod_1.z.number().int().optional(),
        startDateTime: zod_1.z.string().nonempty().optional(),
        endDateTime: zod_1.z.string().nonempty().optional(),
        image: zod_1.z.string().nonempty().optional(),
    }),
});
exports.FlashSaleValidationSchema = {
    createFlashSaleValidationSchema,
    updateFlashSaleValidationSchema,
};
