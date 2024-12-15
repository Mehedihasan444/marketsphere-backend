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
exports.ShopServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const paginationHelper_1 = require("../../utils/paginationHelper");
const createShopIntoDB = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    if (images === null || images === void 0 ? void 0 : images.logo) {
        const image = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(images.logo[0].originalname, images.logo[0].path);
        payload.logo = image.secure_url;
    }
    if (images === null || images === void 0 ? void 0 : images.banner) {
        const image = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(images.banner[0].originalname, images.banner[0].path);
        payload.banner = image.secure_url;
    }
    const shop = yield prisma_1.default.shop.create({
        data: payload,
    });
    return shop;
});
const getAllShopsFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
            ],
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.shop.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        include: {
            vendor: true,
        },
    });
    const total = yield prisma_1.default.shop.count({
        where: whereConditions,
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
const getSingleShopFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: id,
        }, include: {
            vendor: true,
            products: true,
            followers: true,
            reviews: true,
            order: true,
            coupon: true,
        },
    });
    return shop;
});
const deleteShopFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    const shop = yield prisma_1.default.shop.delete({
        where: {
            id: id,
        },
    });
    return shop;
});
const updateShopInDB = (id, payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    if (images === null || images === void 0 ? void 0 : images.logo) {
        const image = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(images.logo[0].originalname, images.logo[0].path);
        payload.logo = image.secure_url;
    }
    if (images === null || images === void 0 ? void 0 : images.banner) {
        const image = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(images.banner[0].originalname, images.banner[0].path);
        payload.banner = image.secure_url;
    }
    const shop = yield prisma_1.default.shop.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return;
});
const updateShopStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    const shop = yield prisma_1.default.shop.update({
        where: {
            id: id,
        },
        data: { status: payload.shopStatus },
    });
    return shop;
});
exports.ShopServices = {
    createShopIntoDB,
    getAllShopsFromDB,
    getSingleShopFromDB,
    deleteShopFromDB,
    updateShopInDB,
    updateShopStatus
};
