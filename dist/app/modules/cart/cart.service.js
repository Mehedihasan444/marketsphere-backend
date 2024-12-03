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
exports.CartServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const addToCart = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = payload;
    const isExist = yield prisma_1.default.cart.findFirst({
        where: {
            customerId,
        },
    });
    if (isExist) {
        payload.cartId = isExist === null || isExist === void 0 ? void 0 : isExist.id;
    }
    if (!isExist) {
        const cartItem = yield prisma_1.default.cart.create({
            data: {
                customerId,
            },
        });
        payload.cartId = cartItem.id;
    }
    const cart = yield prisma_1.default.cartItem.create({
        data: payload,
    });
    return cart;
});
const getCartItems = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    const carts = yield prisma_1.default.cart.findFirst({
        where: {
            customerId,
        },
    });
    return carts;
});
const updateCartItem = (cartItemId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.cartItem.findUniqueOrThrow({ where: { id: cartItemId } });
    const result = yield prisma_1.default.cartItem.update({
        where: { id: cartItemId },
        data: payload,
    });
    return result;
});
const removeCartItem = (cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.cartItem.findUniqueOrThrow({ where: { id: cartItemId } });
    const result = yield prisma_1.default.cartItem.delete({
        where: {
            id: cartItemId,
        },
    });
    return result;
});
const clearCart = (cartId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.cartItem.deleteMany({
        where: {
            cartId,
        },
    });
});
exports.CartServices = {
    addToCart,
    getCartItems,
    removeCartItem,
    updateCartItem,
    clearCart,
};
