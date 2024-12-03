import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    customerId: z
      .string({
        required_error: "Customer Id is required",
      })
      .uuid(),
    productId: z
      .string({
        required_error: "Product Id is required",
      })
      .uuid(),
    shopId: z
      .string({
        required_error: "Shop Id is required",
      })
      .uuid(),
    rating: z
      .number({
        required_error: "Rating is required",
      })
      .min(1)
      .max(5),
    comment: z
      .string({
        required_error: "Comment is required",
      })
      .min(1)
      .max(255),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    customerId: z
      .string({
        required_error: "Customer Id is required",
      })
      .uuid()
      .optional(),
    productId: z
      .string({
        required_error: "Product Id is required",
      })
      .uuid()
      .optional(),
    shopId: z
      .string({
        required_error: "Shop Id is required",
      })
      .uuid()
      .optional(),
    rating: z
      .number({
        required_error: "Rating is required",
      })
      .min(1)
      .max(5)
      .optional(),
    comment: z
      .string({
        required_error: "Comment is required",
      })
      .optional(),
  }),
});

export const reviewValidationSchema = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};
