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
exports.UserServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
const user_constant_1 = require("./user.constant");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
// Create a new admin user
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, 12);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield transactionClient.user.create({
            data: Object.assign(Object.assign({}, payload), { password: hashedPassword, role: client_1.Role.ADMIN }),
        });
        const admin = yield transactionClient.admin.create({
            data: {
                name: user.name,
                email: user.email,
            },
        });
        return admin;
    }));
    return result;
});
// Create a new customer user
const createCustomer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, 12);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield transactionClient.user.create({
            data: Object.assign(Object.assign({}, payload), { password: hashedPassword, role: client_1.Role.CUSTOMER }),
        });
        const customer = yield transactionClient.customer.create({
            data: {
                name: user.name,
                email: user.email,
            },
        });
        return customer;
    }));
    return result;
});
// Create a new vendor user
const createVendor = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, 12);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield transactionClient.user.create({
            data: Object.assign(Object.assign({}, payload), { password: hashedPassword, role: client_1.Role.CUSTOMER }),
        });
        const vendor = yield transactionClient.vendor.create({
            data: {
                name: payload.name,
                email: user.email,
                shopName: payload.shopName,
                shopLogo: payload.shopLogo,
                description: payload.description,
            },
        });
        return vendor;
    }));
    return result;
});
//  Get all users from the database
const getAllUsersFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: user_constant_1.UserSearchableFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = andCondions.length > 0 ? { AND: andCondions } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            // admin: true,
        },
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditons,
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
// delete a user from the database
const deleteUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.role === "ADMIN") {
        throw new Error("You can not delete an admin user");
    }
    const result = yield prisma_1.default.user.delete({ where: { id: userId } });
    return result;
});
// change the status of a user
const changeProfileStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const updateUserStatus = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: status,
    });
    return updateUserStatus;
});
// get a single user from the database
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true,
        },
    });
    let profileInfo;
    if (userInfo.role === client_1.Role.SUPER_ADMIN) {
        profileInfo = yield prisma_1.default.admin.findUnique({
            where: {
                email: userInfo.email,
            },
            include: {
                user: true,
            },
        });
    }
    else if (userInfo.role === client_1.Role.ADMIN) {
        profileInfo = yield prisma_1.default.admin.findUnique({
            where: {
                email: userInfo.email,
            },
            include: {
                user: true,
            },
        });
    }
    else if (userInfo.role === client_1.Role.CUSTOMER) {
        profileInfo = yield prisma_1.default.customer.findUnique({
            where: {
                email: userInfo.email,
            },
            include: {
                user: true,
            },
        });
    }
    else if (userInfo.role === client_1.Role.VENDOR) {
        profileInfo = yield prisma_1.default.vendor.findUnique({
            where: {
                email: userInfo.email,
            },
            include: {
                user: true,
            },
        });
    }
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const updateMyProfile = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const { profilePhoto } = req.file;
    if (profilePhoto) {
        const uploadToCloudinary = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(profilePhoto.originalname, profilePhoto.path);
        req.body.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    let profileInfo;
    if (userInfo.role === client_1.Role.SUPER_ADMIN) {
        profileInfo = yield prisma_1.default.admin.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    else if (userInfo.role === client_1.Role.ADMIN) {
        profileInfo = yield prisma_1.default.admin.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    else if (userInfo.role === client_1.Role.VENDOR) {
        profileInfo = yield prisma_1.default.vendor.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    else if (userInfo.role === client_1.Role.CUSTOMER) {
        profileInfo = yield prisma_1.default.customer.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    return Object.assign({}, profileInfo);
});
exports.UserServices = {
    createAdmin,
    createCustomer,
    createVendor,
    getAllUsersFromDB,
    deleteUserFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile,
    // getSingleUserFromDB,
    // updateUser,
};
