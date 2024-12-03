"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidationSchema = void 0;
const zod_1 = require("zod");
const createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        description: zod_1.z.string().min(1, "Description is required"),
        image: zod_1.z.string().optional(),
        isDeleted: zod_1.z.boolean().optional(),
        shopId: zod_1.z.string().optional(),
    }),
});
const updateCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").optional(),
        description: zod_1.z.string().min(1, "Description is required").optional(),
        image: zod_1.z.string().optional(),
        isDeleted: zod_1.z.boolean().optional(),
        shopId: zod_1.z.string().optional(),
    }),
});
exports.categoryValidationSchema = {
    createCategoryValidationSchema: createCategorySchema,
    updateCategoryValidationSchema: updateCategorySchema,
};
