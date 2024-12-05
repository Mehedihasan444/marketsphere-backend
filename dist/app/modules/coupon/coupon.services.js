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
exports.CouponServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
//  Create a coupon
const createCoupon = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const checkShopCoupon = yield prisma_1.default.coupon.findFirst({
        where: {
            shopId: payload.shopId,
        },
    });
    if (!checkShopCoupon) {
        yield prisma_1.default.coupon.create({
            data: {
                shopId: payload.shopId,
            },
        });
    }
    const coupon = yield prisma_1.default.couponItem.create({ data: payload });
    return coupon;
});
//  Apply coupon to a user
const applyCoupon = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.couponItem.findFirst({
        where: {
            code: payload.code,
            couponId: payload.couponId,
            discount: payload.discount,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid coupon code");
    }
    if (isExist.expiryDate < new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Coupon has expired");
    }
    return true;
});
//  Get all coupons
const getAllCoupons = () => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findMany();
    return coupon;
});
//  Get all coupons of a shop
const getSingleShopCoupons = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findMany({ where: { shopId } });
    return coupon;
});
//  Delete a coupon
const deleteCoupon = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.couponItem.delete({ where: { id } });
    return coupon;
});
//  Update a coupon
const updateCoupon = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.couponItem.findUniqueOrThrow({ where: { id } });
    const coupon = yield prisma_1.default.couponItem.update({
        where: { id },
        data: Object.assign({}, payload),
    });
    return coupon;
});
exports.CouponServices = {
    createCoupon,
    getAllCoupons,
    getSingleShopCoupons,
    deleteCoupon,
    updateCoupon,
    applyCoupon,
};
