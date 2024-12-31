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
exports.ProductServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../config/prisma"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const createProduct = (files, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (files) {
        const images = files;
        const imageUrls = yield Promise.all(images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            const imageName = image === null || image === void 0 ? void 0 : image.originalname;
            const path = image === null || image === void 0 ? void 0 : image.path;
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            return secure_url;
        })));
        payload.images = imageUrls;
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield tx.product.create({
            data: Object.assign({}, payload),
        });
        yield tx.review.create({
            data: {
                shopId: product.shopId,
                productId: product.id,
            },
        });
        return product;
    }));
    return result;
});
const getAllProductsFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
                { category: { name: { contains: searchTerm, mode: "insensitive" } } }
            ],
        });
    }
    if (filterData.category) {
        andConditions.push({
            category: {
                name: {
                    equals: filterData.category,
                    mode: "insensitive",
                },
            },
        });
        delete filterData.category;
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        include: {
            category: true,
            shop: true,
            cartItems: true,
            orderItems: true,
            reviews: true,
        },
    });
    const total = yield prisma_1.default.product.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAllVendorProducts = (params, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Calculate pagination details
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    // Extract searchTerm and other filter data
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    // Search products by name, description, or category name
    if (searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
                { category: { name: { contains: searchTerm, mode: "insensitive" } } },
            ],
        });
    }
    // Filter products by category name
    if (filterData.category) {
        andConditions.push({
            category: {
                name: {
                    equals: filterData.category,
                    mode: "insensitive",
                },
            },
        });
        delete filterData.category; // Remove 'category' from filterData as it's already processed
    }
    // Add any remaining filters (e.g., filtering by price, stock, etc.)
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    // Fetch the vendor and their associated shops
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: { email: user.email },
        include: { shop: true }, // Include shops associated with the vendor
    });
    // Ensure vendor and shops exist
    if (!vendor || !vendor.shop || vendor.shop.length === 0) {
        throw new Error("No shops found for the vendor");
    }
    // Extract shop IDs
    const shopIds = vendor.shop.map((shop) => shop.id);
    // Add a condition to filter products by shop IDs
    andConditions.push({
        shopId: {
            in: shopIds, // Use `in` for matching multiple shop IDs
        },
    });
    // Combine all conditions
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    // Fetch products with pagination, sorting, and relationships
    const result = yield prisma_1.default.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        include: {
            category: true,
            shop: true,
            cartItems: true,
            orderItems: true,
            reviews: true,
        },
    });
    // Get the total count of products matching the conditions
    const total = yield prisma_1.default.product.count({
        where: whereConditions,
    });
    // Return paginated data
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getPriorityProducts = (params, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Calculate pagination details
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    if (user.role === client_1.Role.CUSTOMER) {
        // Find the customer by their email
        const customer = yield prisma_1.default.customer.findUniqueOrThrow({
            where: { email: user.email },
        });
        // Fetch shops followed by the customer
        const followedShops = yield prisma_1.default.follow.findMany({
            where: {
                customerId: customer.id,
            },
            select: {
                shopId: true, // Only return shop IDs
            },
        });
        // Extract shop IDs from the follow records
        const followedShopIds = followedShops.map((follow) => follow.shopId);
        let allProducts = [];
        if (followedShopIds.length > 0) {
            // Fetch products from followed shops
            const followedShopProducts = yield prisma_1.default.product.findMany({
                where: {
                    shopId: {
                        in: followedShopIds, // Filter products belonging to followed shops
                    },
                    isDeleted: false, // Exclude deleted products
                },
                orderBy: {
                    createdAt: "desc", // Sort by newest first
                },
                include: {
                    shop: true, // Include shop details if needed
                },
            });
            // Fetch products from other shops
            const otherShopProducts = yield prisma_1.default.product.findMany({
                where: {
                    shopId: {
                        notIn: followedShopIds, // Exclude products from followed shops
                    },
                    isDeleted: false, // Exclude deleted products
                },
                orderBy: {
                    createdAt: "desc", // Sort by newest first
                },
                include: {
                    shop: true, // Include shop details if needed
                },
            });
            // Combine the two arrays, with followed shop products first
            allProducts = [...followedShopProducts, ...otherShopProducts];
        }
        else {
            // If the user doesn’t follow any shop, fetch all products
            allProducts = yield prisma_1.default.product.findMany({
                where: {
                    isDeleted: false, // Exclude deleted products
                },
                orderBy: {
                    createdAt: "desc", // Sort by newest first
                },
                include: {
                    shop: true, // Include shop details if needed
                },
            });
        }
        // Paginate the combined products
        const paginatedProducts = allProducts.slice(skip, skip + limit);
        // Return paginated data
        return {
            meta: {
                page,
                limit,
                total: allProducts.length,
            },
            data: paginatedProducts,
        };
    }
    else {
        // Fetch products with pagination, sorting, and relationships
        const result = yield prisma_1.default.product.findMany({
            where: {
                isDeleted: false,
            },
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder,
                }
                : {
                    createdAt: "desc",
                },
            include: {
                category: true,
                shop: true,
                cartItems: true,
                orderItems: true,
                reviews: true,
            },
        });
        // Get the total count of products matching the conditions
        const total = yield prisma_1.default.product.count({
            where: {
                isDeleted: false,
            },
        });
        // Return paginated data
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: result,
        };
    }
});
const getSingleProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUniqueOrThrow({
        where: { id },
        include: {
            category: true,
            shop: true,
            cartItems: true,
            orderItems: true,
            reviews: true,
        },
    });
    return product;
});
const deleteProductFromDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUniqueOrThrow({
        where: { id: productId },
    });
    const result = yield prisma_1.default.product.delete({
        where: { id: productId },
    });
    return result;
});
const updateProduct = (productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUniqueOrThrow({
        where: { id: productId },
    });
    const result = yield prisma_1.default.product.update({
        where: { id: productId },
        data: payload,
    });
    return result;
});
exports.ProductServices = {
    createProduct,
    getAllProductsFromDB,
    getSingleProductFromDB,
    deleteProductFromDB,
    updateProduct,
    getAllVendorProducts,
    getPriorityProducts
};
