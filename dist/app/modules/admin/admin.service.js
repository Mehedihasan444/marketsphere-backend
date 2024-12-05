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
exports.AdminServices = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../utils/paginationHelper");
const prisma_1 = __importDefault(require("../../config/prisma"));
const admin_constant_1 = require("./admin.constant");
//  Get all Admin from the database
const getAllAdminFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: admin_constant_1.AdminSearchableFields.map((field) => ({
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
    const result = yield prisma_1.default.admin.findMany({
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
            email: true,
            user: true,
        },
    });
    const total = yield prisma_1.default.admin.count({
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
const getSingleAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const Admin = yield prisma_1.default.admin.findUniqueOrThrow({ where: { id }, include: { user: true } });
    return Admin;
});
//  Delete a customer from the database
const deleteAdminFromDB = (adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma_1.default.admin.findUniqueOrThrow({ where: { id: adminId }, include: { user: true } });
    if (admin.user.role !== client_1.Role.ADMIN) {
        throw new Error("You cannot delete an admin user");
    }
    const result = yield prisma_1.default.admin.delete({ where: { id: adminId } });
    return result;
});
const updateAdmin = (adminId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.admin.findUniqueOrThrow({
        where: { id: adminId },
    });
    const result = yield prisma_1.default.admin.update({
        where: { id: adminId },
        data: payload,
    });
    return result;
});
exports.AdminServices = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    deleteAdminFromDB,
    updateAdmin,
};
