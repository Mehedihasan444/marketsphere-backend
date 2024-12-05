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
exports.CouponControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const coupon_services_1 = require("./coupon.services");
const createCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_services_1.CouponServices.createCoupon(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Coupon created Successfully",
        data: coupon,
    });
}));
const applyCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_services_1.CouponServices.applyCoupon(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Coupon applied Successfully",
        data: coupon,
    });
}));
const getAllCoupons = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_services_1.CouponServices.getAllCoupons();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Coupons retrieved Successfully",
        data: coupon,
    });
}));
const getSingleShopCoupons = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = req.body;
    const coupon = yield coupon_services_1.CouponServices.getSingleShopCoupons(shopId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Coupons retrieved Successfully",
        data: coupon,
    });
}));
const deleteCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_services_1.CouponServices.deleteCoupon(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Coupon deleted Successfully",
        data: coupon,
    });
}));
const updateCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_services_1.CouponServices.updateCoupon(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Coupon updated Successfully",
        data: coupon,
    });
}));
exports.CouponControllers = {
    createCoupon,
    getAllCoupons,
    getSingleShopCoupons,
    deleteCoupon,
    updateCoupon,
    applyCoupon
};
