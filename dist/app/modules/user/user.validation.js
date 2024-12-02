"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        role: zod_1.z.nativeEnum(client_1.Role),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email({
            message: "Invalid email",
        }),
        password: zod_1.z.string({
            required_error: "Password is required",
        }),
        status: zod_1.z.nativeEnum(client_1.UserStatus).default(client_1.UserStatus.ACTIVE),
        mobileNumber: zod_1.z.string().optional(),
    }),
});
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        role: zod_1.z.nativeEnum(client_1.Role).optional(),
        email: zod_1.z.string().email().optional(),
        password: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(client_1.UserStatus).optional(),
        mobileNumber: zod_1.z.string().optional(),
        profilePhoto: zod_1.z.string().optional().nullable(),
    }),
});
exports.UserValidation = {
    createUserValidationSchema,
    updateUserValidationSchema,
};
