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
/* eslint-disable @typescript-eslint/no-explicit-any */
const prisma_1 = __importDefault(require("../../config/prisma"));
const user_constant_1 = require("./user.constant");
const queryBuilder_1 = __importDefault(require("../../queryBuilder"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.create({ data: payload });
    return user;
});
//  Get all users from the database
// const getAllUsersFromDB = async (params: any, options: any) => {
//   const { page, limit, skip, sortBy, sortOrder } = options;
//   const { searchTerm,...filterData } = params;
//   const andCondions: Prisma.UserWhereInput[] = [];
//   //console.log(filterData);
//   if (params.searchTerm) {
//       andCondions.push({
//           OR: UserSearchableFields.map(field => ({
//               [field]: {
//                   contains: params.searchTerm,
//                   mode: 'insensitive'
//               }
//           }))
//       })
//   };
//   if (Object.keys(filterData).length > 0) {
//       andCondions.push({
//           AND: Object.keys(filterData).map(key => ({
//               [key]: {
//                   equals: (filterData as any)[key]
//               }
//           }))
//       })
//   };
//   const whereConditons: Prisma.UserWhereInput = andCondions.length > 0 ? { AND: andCondions } : {};
//   const result = await prisma.user.findMany({
//       where: whereConditons,
//       skip,
//       take: limit,
//       orderBy: options.sortBy && options.sortOrder ? {
//           [options.sortBy]: options.sortOrder
//       } : {
//           createdAt: 'desc'
//       },
//       select: {
//           id: true,
//           email: true,
//           role: true,
//           needPasswordChange: true,
//           status: true,
//           createdAt: true,
//           updatedAt: true,
//           // admin: true,
//       }
//   });
//   const total = await prisma.user.count({
//       where: whereConditons
//   });
//   return {
//       meta: {
//           page,
//           limit,
//           total
//       },
//       data: result
//   };
// };
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = query, filterData = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder"]) // Extract filter data (non-search-related filters)
    ;
    // Initialize QueryBuilder for the User model
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.user);
    // Apply search conditions
    if (searchTerm) {
        queryBuilder.search(user_constant_1.UserSearchableFields, searchTerm);
    }
    // Apply filters
    if (Object.keys(filterData).length > 0) {
        queryBuilder.filter(filterData);
    }
    // Apply sorting and pagination
    queryBuilder
        .sort(sortBy, sortOrder)
        .paginate(page, limit);
    // Execute query and count total results
    const data = yield queryBuilder.execute();
    const total = yield queryBuilder.count();
    // Return formatted response
    return {
        meta: {
            page,
            limit,
            total,
        },
        data,
    };
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({ where: { id } });
    return user;
});
const deleteUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.role === "ADMIN") {
        throw new Error("You can not delete an admin user");
    }
    const result = yield prisma_1.default.user.delete({ where: { id: userId } });
    return result;
});
const updateUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({ where: { id: userId } });
    const result = yield prisma_1.default.user.update({
        where: { id: userId },
        data: payload,
    });
    return result;
});
exports.UserServices = {
    createUser,
    getAllUsersFromDB,
    getSingleUserFromDB,
    deleteUserFromDB,
    updateUser,
};
