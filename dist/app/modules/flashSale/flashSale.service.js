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
exports.FlashSaleServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createFlashSale = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const image = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.originalname, file.path);
        payload.image = image.secure_url;
    }
    const flashSale = yield prisma_1.default.flashSale.create({ data: payload });
    return flashSale;
});
const addProductToFlashSale = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const flashSale = yield prisma_1.default.flashSale.findUniqueOrThrow({
        where: { id: data.flashSaleId },
    });
    const product = yield prisma_1.default.product.findUniqueOrThrow({
        where: { id: data.productId },
    });
    yield prisma_1.default.flashSaleItem.create({
        data: {
            flashSaleId: flashSale.id,
            productId: product.id,
            discount: data.discount,
        },
    });
    return flashSale;
});
const deleteProductToFlashSale = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const flashSaleItem = yield prisma_1.default.flashSaleItem.findUniqueOrThrow({
        where: { id },
    });
    yield prisma_1.default.flashSaleItem.delete({ where: { id } });
    return flashSaleItem;
});
const getAllFlashSales = () => __awaiter(void 0, void 0, void 0, function* () {
    const flashSales = yield prisma_1.default.flashSale.findMany();
    return flashSales;
});
const getSingleFlashSale = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const flashSale = yield prisma_1.default.flashSale.findUnique({
        where: {
            id: id
        },
        include: {
            flashSaleItems: true
        }
    });
    if (!flashSale) {
        throw new AppError_1.default(404, 'Flash Sale not found');
    }
    return flashSale;
});
const updateFlashSale = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.flashSale.findUniqueOrThrow({ where: { id } });
    const flashSale = yield prisma_1.default.flashSale.update({
        where: { id },
        data,
    });
    return flashSale;
});
const deleteFlashSale = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.flashSale.findUniqueOrThrow({ where: { id } });
    const flashSale = yield prisma_1.default.flashSale.delete({ where: { id } });
    return flashSale;
});
const getVendorProductsInFlashSale = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the vendor and their associated shops
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: { email: user === null || user === void 0 ? void 0 : user.email },
        include: { shop: true }, // Include shops associated with the vendor
    });
    // Ensure vendor and shops exist
    if (!vendor || !vendor.shop || vendor.shop.length === 0) {
        throw new Error("No shops found for the vendor");
    }
    // Extract shop IDs
    const shopIds = vendor.shop.map((shop) => shop.id);
    // Fetch products with pagination, sorting, and relationships
    const result = yield prisma_1.default.flashSaleItem.findMany({
        where: {
            product: {
                shopId: {
                    in: shopIds, // Use `in` for matching multiple shop IDs
                },
            },
        },
        include: {
            flashSale: true,
            product: true,
        },
    });
    return result;
});
const getProductsInFlashSale = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma_1.default.flashSaleItem.findMany({
        include: {
            product: true,
            flashSale: true
        }
    });
    return products;
});
exports.FlashSaleServices = {
    createFlashSale,
    getAllFlashSales,
    getSingleFlashSale,
    deleteFlashSale,
    addProductToFlashSale,
    updateFlashSale,
    deleteProductToFlashSale,
    getVendorProductsInFlashSale,
    getProductsInFlashSale
};
