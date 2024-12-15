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
exports.FollowServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const followShop = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.follow.findUnique({
        where: {
            customerId_shopId: {
                customerId: payload.customerId,
                shopId: payload.shopId,
            },
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have already followed this shop.");
    }
    const result = yield prisma_1.default.follow.create({
        data: {
            customerId: payload.customerId,
            shopId: payload.shopId,
        },
    });
    return result;
});
const unfollowShop = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.follow.findUnique({
        where: {
            customerId_shopId: {
                customerId: payload.customerId,
                shopId: payload.shopId,
            },
        },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are not following this shop.");
    }
    const result = yield prisma_1.default.follow.delete({
        where: {
            customerId_shopId: {
                customerId: payload.customerId,
                shopId: payload.shopId,
            },
        },
    });
    return result;
});
const getFollowedShops = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.customer.findFirst({
        where: {
            email: userEmail,
        },
        include: {
            follow: {
                include: {
                    shop: true,
                },
            },
        },
    });
    return result === null || result === void 0 ? void 0 : result.follow;
});
exports.FollowServices = {
    followShop,
    unfollowShop,
    getFollowedShops,
};
