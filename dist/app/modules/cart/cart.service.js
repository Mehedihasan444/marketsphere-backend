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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// Add to cart
// const addToCart = async (payload: any) => {
//   const customer = await prisma.customer.findFirstOrThrow({
//     where: {
//       email: payload.email,
//     },
//   });
//   const customerId = customer.id;
//   const getCart = await prisma.cart.findFirstOrThrow({
//     where: {
//       customerId,
//     },
//   });
//   const info = {
//     productId: payload.productId,
//     cartId: getCart.id,
//     quantity: payload?.quantity || 1,
//   };
//   const isExist = await prisma.cartItem.findFirst({
//     where: {
//       productId: payload.productId,
//       cartId: getCart.id,
//     },
//   })
//   if (isExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Product already in cart");
//   }
//   const cart = await prisma.cartItem.create({
//     data: info,
//   });
//   return cart;
// };
const addToCart = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findFirstOrThrow({
        where: {
            email: payload.email,
        },
    });
    const customerId = customer.id;
    const getCart = yield prisma_1.default.cart.findFirstOrThrow({
        where: {
            customerId,
        },
    });
    const info = {
        productId: payload.productId,
        cartId: getCart.id,
        quantity: (payload === null || payload === void 0 ? void 0 : payload.quantity) || 1,
    };
    const isExist = yield prisma_1.default.cartItem.findFirst({
        where: {
            productId: payload.productId,
            cartId: getCart.id,
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Product already in cart");
    }
    const product = yield prisma_1.default.product.findFirstOrThrow({
        where: {
            id: payload.productId,
        },
    });
    const shop = yield prisma_1.default.shop.findFirstOrThrow({
        where: {
            id: product.shopId,
        },
    });
    const checkCartItemsVendorSameOrNot = yield prisma_1.default.cartItem.findFirst({
        where: {
            cartId: getCart.id,
        },
        include: {
            product: {
                include: {
                    shop: true,
                },
            },
        },
    });
    if (checkCartItemsVendorSameOrNot) {
        if (checkCartItemsVendorSameOrNot.product.shop.vendorId !== shop.vendorId) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You can't add products from different vendors in the same cart.");
        }
    }
    const cart = yield prisma_1.default.cartItem.create({
        data: info,
    });
    return cart;
});
const getCartItems = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findFirstOrThrow({
        where: {
            email,
        },
    });
    const carts = yield prisma_1.default.cart.findFirst({
        where: {
            customerId: customer.id,
        },
        include: {
            cartItems: { include: { product: true } },
        },
    });
    return carts === null || carts === void 0 ? void 0 : carts.cartItems;
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
    yield prisma_1.default.cartItem.findFirstOrThrow({ where: { cartId } });
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
