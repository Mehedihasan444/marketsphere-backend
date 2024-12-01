"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        role: zod_1.z.nativeEnum(user_constant_1.USER_ROLE),
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
        status: zod_1.z.nativeEnum(user_constant_1.USER_STATUS).default(user_constant_1.USER_STATUS.ACTIVE),
        mobileNumber: zod_1.z.string().optional(),
    }),
});
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        role: zod_1.z.nativeEnum(user_constant_1.USER_ROLE).optional(),
        email: zod_1.z.string().email().optional(),
        password: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(user_constant_1.USER_STATUS).optional(),
        mobileNumber: zod_1.z.string().optional(),
        profilePhoto: zod_1.z.string().optional().nullable(),
    }),
});
exports.UserValidation = {
    createUserValidationSchema,
    updateUserValidationSchema,
};
