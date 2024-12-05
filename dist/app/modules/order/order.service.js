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
exports.OrderServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../config/prisma"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const orderData = {
            customerId: payload.customerId,
            shopId: payload.shopId,
            quantity: payload.quantity,
            totalAmount: payload.totalAmount,
            discount: payload.discount,
            orderNumber: payload.orderNumber,
        };
        const order = yield transactionClient.order.create({
            data: orderData,
        });
        payload.orderItems.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionClient.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: item.productId,
                    quantity: payload.quantity,
                },
            });
        }));
    }));
});
const getAllOrdersFromDB = (params, options, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                { orderNumber: { contains: searchTerm, mode: "insensitive" } },
                {
                    customer: {
                        user: { name: { contains: searchTerm, mode: "insensitive" } },
                    },
                },
            ],
        });
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
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: { email: userEmail },
    });
    if (user.role === client_1.Role.CUSTOMER) {
        const customer = yield prisma_1.default.customer.findUniqueOrThrow({
            where: { email: user.email },
        });
        whereConditions.customerId = customer.id;
    }
    else if (user.role === client_1.Role.VENDOR) {
        yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
            const vendor = yield transactionClient.vendor.findUniqueOrThrow({
                where: { email: user.email },
            });
            const shop = yield transactionClient.shop.findUniqueOrThrow({
                where: { vendorId: vendor.id },
            });
            whereConditions.shopId = shop.id;
        }));
    }
    const result = yield prisma_1.default.order.findMany({
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
            orderItems: true,
        },
    });
    const total = yield prisma_1.default.order.count({
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
const getSingleOrderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma_1.default.order.findUniqueOrThrow({
        where: { id },
        include: {
            customer: true,
            orderItems: true,
        },
    });
    return order;
});
const deleteOrderFromDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.order.findUniqueOrThrow({
        where: { id: orderId },
    });
    const result = yield prisma_1.default.order.delete({
        where: { id: orderId },
    });
    return result;
});
const updateOrder = (orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.order.findUniqueOrThrow({
        where: { id: orderId },
    });
    const result = yield prisma_1.default.order.update({
        where: { id: orderId },
        data: payload,
    });
    return result;
});
exports.OrderServices = {
    createOrder,
    getAllOrdersFromDB,
    getSingleOrderFromDB,
    deleteOrderFromDB,
    updateOrder,
};
