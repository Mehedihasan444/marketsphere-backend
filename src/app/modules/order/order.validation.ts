import { z } from "zod";

const createOrderSchema = z.object({
  body: z.object({
    userId: z.string(),
    quantity: z.number().int().positive(),
    totalAmount: z.number().positive(),
    orderNumber: z.string().optional(), // This will be generated in the service
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
    isDeleted: z.boolean().optional(),
    orderItems: z
      .array(
        z.object({
          // Define the structure of order items here
        })
      )
      .optional(),
    coupons: z
      .array(
        z.object({
          // Define the structure of coupons here
        })
      )
      .optional(),
  }),
});

const updateOrderSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    quantity: z.number().int().positive().optional(),
    totalAmount: z.number().positive().optional(),
    orderNumber: z.string().optional(), // This should not be updated
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
    isDeleted: z.boolean().optional(),
    orderItems: z
      .array(
        z.object({
          // Define the structure of order items here
        })
      )
      .optional(),
    coupons: z
      .array(
        z.object({
          // Define the structure of coupons here
        })
      )
      .optional(),
  }),
});

export const orderValidationSchema = {
  createOrderValidationSchema: createOrderSchema,
  updateOrderValidationSchema: updateOrderSchema,
};
