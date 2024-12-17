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
exports.RecentViewProductsServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
// const createRecentViewProduct = async (userEmail: string, productId: string) => {
//     const customer = await prisma.customer.findFirstOrThrow({
//         where: {
//             email: userEmail
//         }
//     })
//     const customerId = customer?.id
//     await prisma.recentProduct.findFirstOrThrow({
//         where: {
//             productId,
//             customerId
//         }
//     })
//     // Add the product to the recent products table
//     await prisma.recentProduct.create({
//         data: {
//             customerId,
//             productId,
//         }
//         // where: { customerId_productId: { customerId, productId } },
//         // update: { viewedAt: new Date() },
//         // create: { customerId, productId },
//     });
//     // Fetch all recent products for this customer, sorted by the most recent first
//     const recentProducts = await prisma.recentProduct.findMany({
//         where: { customerId },
//         orderBy: { viewedAt: 'desc' },
//     });
//     // Keep only the 10 most recent products
//     if (recentProducts.length > 10) {
//         const oldProductIds = recentProducts
//             .slice(10) // Get the products beyond the 10th entry
//             .map((product) => product.id);
//         // Delete the older products
//         await prisma.recentProduct.deleteMany({
//             where: { id: { in: oldProductIds } },
//         });
//     }
// }
const createRecentViewProduct = (userEmail, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the customer by email
    const customer = yield prisma_1.default.customer.findFirst({
        where: { email: userEmail },
    });
    if (!customer) {
        throw new Error("Customer not found");
    }
    const customerId = customer.id;
    // Check if the recent product already exists
    const existingRecentProduct = yield prisma_1.default.recentProduct.findFirst({
        where: { productId, customerId },
    });
    if (!existingRecentProduct) {
        // Create the product only if it doesn't exist
        yield prisma_1.default.recentProduct.create({
            data: {
                customerId,
                productId,
            },
        });
    }
    else {
        // Update the viewedAt timestamp if the record already exists
        yield prisma_1.default.recentProduct.update({
            where: { id: existingRecentProduct.id },
            data: { viewedAt: new Date() },
        });
    }
    // Fetch all recent products for this customer, sorted by the most recent first
    const recentProducts = yield prisma_1.default.recentProduct.findMany({
        where: { customerId },
        orderBy: { viewedAt: "desc" },
    });
    // Keep only the 10 most recent products
    if (recentProducts.length > 10) {
        const oldProductIds = recentProducts
            .slice(10) // Get the products beyond the 10th entry
            .map((product) => product.id);
        // Delete the older products
        yield prisma_1.default.recentProduct.deleteMany({
            where: { id: { in: oldProductIds } },
        });
    }
});
const getRecentViewProducts = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findFirstOrThrow({
        where: {
            email: userEmail
        }
    });
    const customerId = customer === null || customer === void 0 ? void 0 : customer.id;
    const recentProducts = yield prisma_1.default.recentProduct.findMany({
        where: { customerId },
        orderBy: { viewedAt: 'desc' },
        include: {
            product: true
        }
    });
    return recentProducts;
});
exports.RecentViewProductsServices = {
    createRecentViewProduct,
    getRecentViewProducts
};
