import { Role, UserStatus } from "@prisma/client";
import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    role: z.nativeEnum(Role),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Invalid email",
      }),
    password: z.string({
      required_error: "Password is required",
    }),
    status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
    mobileNumber: z.string().optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    role: z.nativeEnum(Role).optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    status: z.nativeEnum(UserStatus).optional(),
    mobileNumber: z.string().optional(),
    profilePhoto: z.string().optional().nullable(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
