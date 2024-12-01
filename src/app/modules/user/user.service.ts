/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../../config/prisma";
import { Admin, Customer, Prisma, Role, User, Vendor } from "@prisma/client";
import { UserSearchableFields } from "./user.constant";
import QueryBuilder from "../../queryBuilder";
import bcrypt from "bcryptjs";
const createAdmin = async (payload: User) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const result = await prisma.$transaction(async (transactionClient) => {
    const user = await transactionClient.user.create({
      data: {
        ...payload,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    const admin = await transactionClient.admin.create({
      data: {
        userId: user.id,
      },
    });
    return admin;
  });

  return result;
};

const createCustomer = async (payload: User & Customer) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const result = await prisma.$transaction(async (transactionClient) => {
    const user = await transactionClient.user.create({
      data: {
        ...payload,
        password: hashedPassword,
        role: Role.CUSTOMER,
      },
    });
    const customer = await transactionClient.customer.create({
      data: {
        userId: user.id,
        phone: payload.phone,
        address: payload.address,
      },
    });
    return customer;
  });

  return result;
};
const createVendor = async (payload: User & Vendor) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const result = await prisma.$transaction(async (transactionClient) => {
    const user = await transactionClient.user.create({
      data: {
        ...payload,
        password: hashedPassword,
        role: Role.CUSTOMER,
      },
    });
    const vendor = await transactionClient.vendor.create({
      data: {
        userId: user.id,
        name: payload.name,
        shopName: payload.shopName,
        shopLogo: payload.shopLogo,
        description: payload.description,
      },
    });
    return vendor;
  });

  return result;
};
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
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    ...filterData // Extract filter data (non-search-related filters)
  } = query;

  // Initialize QueryBuilder for the User model
  const queryBuilder = new QueryBuilder<
    Prisma.UserGetPayload<{}>,
    Prisma.UserFindManyArgs
  >(prisma.user);

  // Apply search conditions
  if (searchTerm) {
    queryBuilder.search(UserSearchableFields, searchTerm as string);
  }

  // Apply filters
  if (Object.keys(filterData).length > 0) {
    queryBuilder.filter(filterData as Prisma.UserWhereInput);
  }

  // Apply sorting and pagination
  queryBuilder
    .sort(sortBy as string, sortOrder as "asc" | "desc")
    .paginate(page as number, limit as number);

  // Execute query and count total results
  const data = await queryBuilder.execute();
  const total = await queryBuilder.count();

  // Return formatted response
  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getSingleUserFromDB = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  return user;
};

const deleteUserFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  if (user.role === "ADMIN") {
    throw new Error("You can not delete an admin user");
  }
  const result = await prisma.user.delete({ where: { id: userId } });
  return result;
};

const updateUser = async (userId: string, payload: User) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });
  return result;
};
export const UserServices = {
  createAdmin,
  createCustomer,
  createVendor,
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUser,
};
