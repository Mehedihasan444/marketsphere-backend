import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    image: z.string().optional(),
    parentId: z.string().optional().nullable(),
    isDeleted: z.boolean().optional(),
    shopId: z.string().optional(),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    image: z.string().optional(),
    parentId: z.string().optional().nullable(),
    isDeleted: z.boolean().optional(),
    shopId: z.string().optional(),
  }),
});

export const categoryValidationSchema = {
  createCategoryValidationSchema: createCategorySchema,
  updateCategoryValidationSchema: updateCategorySchema,
};
