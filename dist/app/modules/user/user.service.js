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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
const user_constant_1 = require("./user.constant");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, 12);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield transactionClient.user.create({
            data: Object.assign(Object.assign({}, payload), { password: hashedPassword, role: client_1.Role.ADMIN }),
        });
        const admin = yield transactionClient.admin.create({
            data: {
                userId: user.id,
            },
        });
        return admin;
    }));
    return result;
});
const createCustomer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, 12);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield transactionClient.user.create({
            data: Object.assign(Object.assign({}, payload), { password: hashedPassword, role: client_1.Role.CUSTOMER }),
        });
        const customer = yield transactionClient.customer.create({
            data: {
                userId: user.id,
                // phone: payload.phone,
                // address: payload.address,
            },
        });
        return customer;
    }));
    return result;
});
const createVendor = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, 12);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield transactionClient.user.create({
            data: Object.assign(Object.assign({}, payload), { password: hashedPassword, role: client_1.Role.CUSTOMER }),
        });
        const vendor = yield transactionClient.vendor.create({
            data: {
                userId: user.id,
                name: payload.name,
                shopName: payload.shopName,
                shopLogo: payload.shopLogo,
                description: payload.description,
            },
        });
        return vendor;
    }));
    return result;
});
//  Get all users from the database
const getAllUsersFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: user_constant_1.UserSearchableFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = andCondions.length > 0 ? { AND: andCondions } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            // admin: true,
        },
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditons,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({ where: { id } });
    return user;
});
const deleteUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.role === "ADMIN") {
        throw new Error("You can not delete an admin user");
    }
    const result = yield prisma_1.default.user.delete({ where: { id: userId } });
    return result;
});
const updateUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({ where: { id: userId } });
    const result = yield prisma_1.default.user.update({
        where: { id: userId },
        data: payload,
    });
    return result;
});
exports.UserServices = {
    createAdmin,
    createCustomer,
    createVendor,
    getAllUsersFromDB,
    getSingleUserFromDB,
    deleteUserFromDB,
    updateUser,
};
