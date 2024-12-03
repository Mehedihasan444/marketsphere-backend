import { z } from "zod";

const followValidationSchema = z.object({
  body: z.object({
    customerId: z
      .string({
        required_error: "Customer Id is required",
      })
      .uuid(),
    shopId: z
      .string({
        required_error: "Shop Id is required",
      })
      .uuid(),
  }),
});

const unfollowValidationSchema = z.object({
  body: z.object({
    customerId: z
      .string({
        required_error: "Customer Id is required",
      })
      .uuid(),
    shopId: z
      .string({
        required_error: "Shop Id is required",
      })
      .uuid(),
  }),
});

export const FollowValidationSchema = {
    followValidationSchema,
    unfollowValidationSchema,
};
