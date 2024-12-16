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
exports.WishlistControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const wishlist_service_1 = require("./wishlist.service");
const addToWishlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlist = yield wishlist_service_1.WishlistServices.addToWishlist(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Wishlist item added Successfully",
        data: wishlist,
    });
}));
const getWishlistItems = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const wishlists = yield wishlist_service_1.WishlistServices.getWishlistItems(user.email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Wishlist items Retrieved Successfully",
        data: wishlists,
    });
}));
const removeWishlistItem = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlistItemId = req.params.id;
    yield wishlist_service_1.WishlistServices.removeWishlistItem(wishlistItemId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Wishlist Item removed Successfully",
        data: null,
    });
}));
const clearWishlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlistId = req.params.id;
    yield wishlist_service_1.WishlistServices.clearWishlist(wishlistId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Wishlist cleared Successfully",
        data: null,
    });
}));
exports.WishlistControllers = {
    addToWishlist,
    getWishlistItems,
    removeWishlistItem,
    clearWishlist
};
