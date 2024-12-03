import { z } from "zod";

const createFlashSaleValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .nonempty(),
    description: z
      .string({
        required_error: "Description is required",
      })
      .nonempty(),
    discount: z
      .number({
        required_error: "Discount is required",
      })
      .int(),
    startDateTime: z
      .string({
        required_error: "Start Date Time is required",
      })
      .nonempty(),
    endDateTime: z
      .string({
        required_error: "End Date Time is required",
      })
      .nonempty(),
    image: z
      .string({
        required_error: "Image is required",
      })
      .nonempty(),
  }),
});
const updateFlashSaleValidationSchema = z.object({
  body: z.object({
    name: z.string().nonempty().optional(),
    description: z.string().nonempty().optional(),
    discount: z.number().int().optional(),
    startDateTime: z.string().nonempty().optional(),
    endDateTime: z.string().nonempty().optional(),
    image: z.string().nonempty().optional(),
  }),
});

export const FlashSaleValidationSchema = {
    createFlashSaleValidationSchema,
    updateFlashSaleValidationSchema,
};
