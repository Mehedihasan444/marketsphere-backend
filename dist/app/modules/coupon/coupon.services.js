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
exports.CouponServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
//  Create a coupon
const createCoupon = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = payload, CouponInfo = __rest(payload, ["shopId"]);
    const checkShopCoupon = yield prisma_1.default.coupon.findFirst({
        where: {
            shopId: shopId,
        },
    });
    if (!checkShopCoupon) {
        yield prisma_1.default.coupon.create({
            data: {
                shopId: shopId,
            },
        });
    }
    const coupon = yield prisma_1.default.coupon.findFirstOrThrow({
        where: {
            shopId: shopId,
        },
    });
    CouponInfo.couponId = coupon.id;
    CouponInfo.expiryDate = new Date(CouponInfo.expiryDate);
    const result = yield prisma_1.default.couponItem.create({ data: CouponInfo });
    return result;
});
//  Apply coupon to a user
const applyCoupon = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { code, shopId } = payload;
    const isExist = yield prisma_1.default.couponItem.findFirst({
        where: {
            code: code,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid coupon code");
    }
    if (isExist.expiryDate < new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Coupon has expired");
    }
    // Check if user is eligible for coupon
    const shop = yield prisma_1.default.shop.findFirstOrThrow({
        where: {
            id: shopId,
        }, include: {
            coupon: {
                include: {
                    couponItem: true
                }
            }
        }
    });
    const coupon = (_b = (_a = shop === null || shop === void 0 ? void 0 : shop.coupon[0]) === null || _a === void 0 ? void 0 : _a.couponItem) === null || _b === void 0 ? void 0 : _b.find((coupon) => (coupon.code === code && coupon.expiryDate > new Date()));
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Coupon is not valid for this shop");
    }
    //  Check if coupon is already used
    const customer = yield prisma_1.default.customer.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email
        },
    });
    const order = yield prisma_1.default.order.findFirst({
        where: {
            customerId: customer.id,
            appliedCoupon: code
        }
    });
    if (order) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Coupon is already used");
    }
    return {
        coupon: true,
        discount: coupon.discount,
    };
});
//  Get all coupons
const getAllCoupons = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendor = yield prisma_1.default.vendor.findFirstOrThrow({
        where: { email: user === null || user === void 0 ? void 0 : user.email },
        include: { shop: true }
    });
    // Extract shop IDs from the vendor's shops
    const shopIds = ((_a = vendor.shop) === null || _a === void 0 ? void 0 : _a.map((shop) => shop.id)) || [];
    // If no shops are associated with the vendor, return an empty array
    if (shopIds.length === 0) {
        return [];
    }
    // Find all coupons linked to the vendor's shops
    const coupons = yield prisma_1.default.coupon.findMany({
        where: { shopId: { in: shopIds } },
        include: {
            couponItem: {
                include: {
                    coupon: true
                }
            }
        }
    });
    return coupons;
});
//  Get all coupons of a shop
const getSingleShopCoupons = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findFirst({
        where: { shopId },
        include: {
            couponItem: true
        }
    });
    return coupon;
});
//  Delete a coupon
const deleteCoupon = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.couponItem.delete({ where: { id } });
    return coupon;
});
//  Update a coupon
const updateCoupon = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = payload, updateInfo = __rest(payload, ["shopId"]);
    updateInfo.expiryDate = new Date(payload.expiryDate);
    yield prisma_1.default.couponItem.findFirstOrThrow({ where: { id } });
    const coupon = yield prisma_1.default.couponItem.update({
        where: { id },
        data: updateInfo,
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
