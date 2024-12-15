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
exports.ReviewServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../config/prisma"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const createReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const { orderId } = payload, reviewData = __rest(payload, ["orderId"]);
        const review = yield transactionClient.reviewItem.create({
            data: reviewData
        });
        const result = yield transactionClient.order.update({
            where: {
                id: payload.orderId
            },
            data: {
                isReview: true
            },
        });
        return review;
    }));
    return review;
});
// const getAllReviewsFromDB = async (
//   params: any,
//   options: any,
//   userEmail: string
// ) => {
//   const { page, limit, skip } = paginationHelper.calculatePagination(options);
//   const { searchTerm, ...filterData } = params;
//   const andConditions: Prisma.ReviewItemWhereInput[] = [];
//   if (searchTerm) {
//     andConditions.push({
//       OR: [{ comment: { contains: searchTerm, mode: "insensitive" } }],
//     });
//   }
//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map((key) => ({
//         [key]: {
//           equals: (filterData as any)[key],
//         },
//       })),
//     });
//   }
//   let whereConditions: Prisma.ReviewItemWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};
//   const user = await prisma.user.findUniqueOrThrow({
//     where: { email: userEmail },
//   });
//   if (user.role === Role.CUSTOMER) {
//     const customer = await prisma.customer.findUniqueOrThrow({
//       where: { email: user.email },
//     });
//     whereConditions.customerId = customer.id;
//   } else if (user.role === Role.VENDOR) {
//     await prisma.$transaction(async (transactionClient) => {
//       const vendor = await transactionClient.vendor.findFirstOrThrow({
//         where: { email: user.email },
//       });
//       const shop = await transactionClient.shop.findMany({
//         where: { vendorId: vendor.id }, include: { vendor: true ,reviews:true},
//       });
//       // const review = await transactionClient.review.findFirstOrThrow({
//       //   where: { shopId: shop.id },
//       // });
//       // whereConditions.shopId = shop.map((shop) => shop.id);
//       const shopIds = shop.map((shop) => shop.id);
//       if (shopIds.length > 0) {
//         whereConditions = { ...whereConditions, shopId: { in: shopIds } };
//       } else {
//         // Handle case where vendor has no associated shops
//         whereConditions = { ...whereConditions, shopId: null };
//       }
//     });
//   }
//   const result = await prisma.reviewItem.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? {
//           [options.sortBy]: options.sortOrder,
//         }
//         : {
//           createdAt: "desc",
//         },include:{
//           customer:true,
//         }
//   });
//   const total = await prisma.reviewItem.count({
//     where: whereConditions,
//   });
//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };
// const getAllReviewsFromDB = async (
//   params: any,
//   options: any,
//   userEmail: string
// ) => {
//   const { page, limit, skip } = paginationHelper.calculatePagination(options);
//   const { searchTerm, ...filterData } = params;
//   const andConditions: Prisma.ReviewItemWhereInput[] = [];
//   // Add searchTerm condition
//   if (searchTerm) {
//     andConditions.push({
//       OR: [{ comment: { contains: searchTerm, mode: "insensitive" } }],
//     });
//   }
//   // Add filter conditions dynamically
//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map((key) => ({
//         [key]: {
//           equals: (filterData as any)[key],
//         },
//       })),
//     });
//   }
//   // Initialize whereConditions
//   let whereConditions: Prisma.ReviewItemWhereInput& Prisma.ReviewWhereInput=
//     andConditions.length > 0 ? { AND: andConditions } : {};
//   // Find the user by email
//   const user = await prisma.user.findUniqueOrThrow({
//     where: { email: userEmail },
//   });
//   if (user.role === Role.CUSTOMER) {
//     // If user is a CUSTOMER, filter reviews by customerId
//     const customer = await prisma.customer.findUniqueOrThrow({
//       where: { email: user.email },
//     });
//     whereConditions = { ...whereConditions, customerId: customer.id };
//   } else if (user.role === Role.VENDOR) {
//     // If user is a VENDOR, filter reviews by shopId(s) associated with the vendor
//     const vendor = await prisma.vendor.findFirstOrThrow({
//       where: { email: user.email },
//     });
//     const shops = await prisma.shop.findMany({
//       where: { vendorId: vendor.id },
//       select: { id: true },
//     });
//     const shopIds = shops.map((shop) => shop.id);
//     if (shopIds.length > 0) {
//       whereConditions = { ...whereConditions, shopId: { in: shopIds } };
//     } else {
//       // Handle case where vendor has no associated shops
//       whereConditions = { ...whereConditions, shopId: undefined };
//     }
//   }
//   // Fetch paginated reviews
//   const result = await prisma.reviewItem.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? {
//             [options.sortBy]: options.sortOrder,
//           }
//         : {
//             createdAt: "desc",
//           },
//     include: {
//       customer: true,
//     },
//   });
//   // Get total count for pagination
//   const total = await prisma.reviewItem.count({
//     where: whereConditions,
//   });
//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };
const getAllReviewsFromDB = (params, options, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    // Add searchTerm condition
    if (searchTerm) {
        andConditions.push({
            OR: [{ comment: { contains: searchTerm, mode: "insensitive" } }],
        });
    }
    // Add filter conditions dynamically
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    // Initialize whereConditions
    let whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    // Find the user by email
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: { email: userEmail },
    });
    if (user.role === client_1.Role.CUSTOMER) {
        // If user is a CUSTOMER, filter reviews by customerId
        const customer = yield prisma_1.default.customer.findUniqueOrThrow({
            where: { email: user.email },
        });
        whereConditions = Object.assign(Object.assign({}, whereConditions), { customerId: customer.id });
    }
    else if (user.role === client_1.Role.VENDOR) {
        // If user is a VENDOR, filter reviews by shopId(s) associated with the vendor
        const vendor = yield prisma_1.default.vendor.findFirstOrThrow({
            where: { email: user.email },
        });
        const shops = yield prisma_1.default.shop.findMany({
            where: { vendorId: vendor.id },
            select: { id: true },
        });
        const shopIds = shops.map((shop) => shop.id);
        if (shopIds.length > 0) {
            // Fetch all products for the vendor's shops
            const products = yield prisma_1.default.product.findMany({
                where: { shopId: { in: shopIds } },
                select: { id: true },
            });
            const productIds = products.map((product) => product.id);
            // Now filter reviews based on the productIds via the Review model
            whereConditions = Object.assign(Object.assign({}, whereConditions), { review: {
                    productId: { in: productIds },
                } });
        }
        else {
            // Handle case where vendor has no associated shops
            whereConditions = Object.assign(Object.assign({}, whereConditions), { review: { productId: undefined } });
        }
    }
    // Fetch paginated reviews
    const result = yield prisma_1.default.reviewItem.findMany({
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
            customer: true,
        },
    });
    // Get total count for pagination
    const total = yield prisma_1.default.reviewItem.count({
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
const getProductReviews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const Review = yield prisma_1.default.product.findFirstOrThrow({
        where: { id },
        include: {
            reviews: {
                include: {
                    reviewItems: true
                }
            },
        },
    });
    return Review.reviews;
});
const getSingleReviewFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const Review = yield prisma_1.default.review.findUniqueOrThrow({
        where: { id },
    });
    return Review;
});
const deleteReviewFromDB = (ReviewId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.reviewItem.findFirstOrThrow({
        where: { id: ReviewId },
    });
    const result = yield prisma_1.default.reviewItem.delete({
        where: { id: ReviewId },
    });
    return result;
});
const updateReview = (ReviewId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.review.findUniqueOrThrow({
        where: { id: ReviewId },
    });
    const result = yield prisma_1.default.review.update({
        where: { id: ReviewId },
        data: payload,
    });
    return result;
});
exports.ReviewServices = {
    createReview,
    getAllReviewsFromDB,
    getSingleReviewFromDB,
    deleteReviewFromDB,
    updateReview,
    getProductReviews,
};
