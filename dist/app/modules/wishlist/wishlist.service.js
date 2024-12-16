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
exports.WishlistServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// Add to wishlist
const addToWishlist = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findFirstOrThrow({
        where: {
            email: payload.email,
        },
    });
    const customerId = customer.id;
    const getWishlist = yield prisma_1.default.wishlist.findFirstOrThrow({
        where: {
            customerId,
        },
    });
    const info = {
        productId: payload.productId,
        wishlistId: getWishlist.id,
        quantity: (payload === null || payload === void 0 ? void 0 : payload.quantity) || 1,
    };
    const isExist = yield prisma_1.default.wishlistItem.findFirst({
        where: {
            productId: payload.productId,
            wishlistId: getWishlist.id,
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Product already in wishlist");
    }
    const wishlist = yield prisma_1.default.wishlistItem.create({
        data: info,
    });
    return wishlist;
});
const getWishlistItems = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findFirstOrThrow({
        where: {
            email,
        },
    });
    const wishlists = yield prisma_1.default.wishlist.findFirst({
        where: {
            customerId: customer.id,
        },
        include: {
            WishlistItem: { include: { product: true } },
        },
    });
    return wishlists === null || wishlists === void 0 ? void 0 : wishlists.WishlistItem;
});
const updateWishlistItem = (wishlistItemId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.wishlistItem.findUniqueOrThrow({ where: { id: wishlistItemId } });
    const result = yield prisma_1.default.wishlistItem.update({
        where: { id: wishlistItemId },
        data: payload,
    });
    return result;
});
const removeWishlistItem = (wishlistItemId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.wishlistItem.findUniqueOrThrow({ where: { id: wishlistItemId } });
    const result = yield prisma_1.default.wishlistItem.delete({
        where: {
            id: wishlistItemId,
        },
    });
    return result;
});
const clearWishlist = (wishlistId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.wishlistItem.findFirstOrThrow({ where: { wishlistId } });
    yield prisma_1.default.wishlistItem.deleteMany({
        where: {
            wishlistId,
        },
    });
});
exports.WishlistServices = {
    addToWishlist,
    getWishlistItems,
    removeWishlistItem,
    updateWishlistItem,
    clearWishlist,
};
