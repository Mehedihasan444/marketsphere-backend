"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../config"));
const prisma_1 = __importDefault(require("../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // at first check if the admin exist of not
        const admin = yield prisma_1.default.user.findFirst({
            where: {
                role: client_1.Role.ADMIN,
                email: config_1.default.admin_email,
                status: client_1.UserStatus.ACTIVE,
            },
        });
        if (!admin) {
            console.log("Seeding started...");
            //hash password
            const hashedPassword = yield bcryptjs_1.default.hash(config_1.default.admin_password, Number(config_1.default.bcrypt_salt_rounds));
            //create admin
            yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield transactionClient.user.create({
                    data: {
                        email: config_1.default.admin_email,
                        name: "Admin",
                        password: hashedPassword,
                        role: client_1.Role.ADMIN,
                        status: client_1.UserStatus.ACTIVE,
                    },
                });
                const admin = yield transactionClient.admin.create({
                    data: {
                        userId: user.id,
                    },
                });
                return admin;
            }));
            console.log("Admin created successfully...");
            console.log("Seeding completed...");
        }
    }
    catch (error) {
        console.log("Error in seeding", error);
    }
});
exports.seed = seed;
