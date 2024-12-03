import { z } from "zod";

// Validation schema for `Product` creation
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required."),
    description: z.string().min(1, "Product description is required."),
    price: z.number().positive("Price must be greater than zero."),
    images: z
      .array(z.string().url("Each image must be a valid URL."))
      .nonempty("At least one image is required."),
    discount: z
      .number()
      .min(0, "Discount must be a non-negative number.")
      .max(100, "Discount cannot exceed 100%."),
    quantity: z
      .number()
      .int("Quantity must be an integer.")
      .nonnegative("Quantity cannot be negative."),
    categoryId: z.string().uuid("Invalid category ID."),
    shopId: z.string().uuid("Invalid shop ID."),
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
  }),
});

export const productValidationSchema = {
  createProductValidationSchema: createProductSchema,
  updateProductValidationSchema: updateProductSchema,
};
