import { is } from './../../../../node_modules/effect/src/Match';
import { z } from "zod";

// Validation schema for `Product` creation
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required."),
    description: z.string().min(1, "Product description is required."),
    price: z.number().positive("Price must be greater than zero."),
    images: z
      .array(z.string())
      .nonempty("At least one image is required.")
      .optional(),
    discount: z
      .number()
      .min(0, "Discount must be a non-negative number.")
      .max(100, "Discount cannot exceed 100%.")
      .optional(),
    quantity: z
      .number()
      .int("Quantity must be an integer.")
      .nonnegative("Quantity cannot be negative."),
    categoryId: z.string(),
    shopId: z.string(),
    brand: z.string().optional(),
    color: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    soldCount: z.number().int().nonnegative().optional(),
    size: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
  }),
});

// Validation schema for `Product` update
export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required.").optional(),
    description: z
      .string()
      .min(1, "Product description is required.")
      .optional(),
    price: z.number().positive("Price must be greater than zero.").optional(),
    images: z
      .array(z.string().url("Each image must be a valid URL."))
      .optional(),
    discount: z
      .number()
      .min(0, "Discount must be a non-negative number.")
      .max(100, "Discount cannot exceed 100%.")
      .optional(),
    quantity: z
      .number()
      .int("Quantity must be an integer.")
      .nonnegative("Quantity cannot be negative.")
      .optional(),
    categoryId: z.string().uuid("Invalid category ID.").optional(),
    shopId: z.string().uuid("Invalid shop ID.").optional(),
    brand: z.string().optional(),
    isFeatured: z.boolean().optional(),
    soldCount: z.number().int().nonnegative().optional(),
    color: z.array(z.string()).optional(),
    size: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
  }),
});

export const productValidationSchema = {
  createProductValidationSchema: createProductSchema,
  updateProductValidationSchema: updateProductSchema,
};
