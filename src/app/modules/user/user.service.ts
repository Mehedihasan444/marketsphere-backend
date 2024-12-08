import prisma from "../../config/prisma";
import {
  Admin,
  Customer,
  Prisma,
  Role,
  User,
  UserStatus,
  Vendor,
} from "@prisma/client";
import { IAuthUser, UserSearchableFields } from "./user.constant";
import bcrypt from "bcryptjs";
import { paginationHelper } from "../../utils/paginationHelper";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { Request } from "express";

// Create a new admin user
const createAdmin = async (payload: User & Admin) => {
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
        name: user.name,
        email: user.email,
      },
    });
    return admin;
  });

  return result;
};
// Create a new customer user
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
        name: user.name,
        email: user.email,
      },
    });
    return customer;
  });

  return result;
};
// Create a new vendor user
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
        name: payload.name,
        email: user.email,
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
const getAllUsersFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: UserSearchableFields.map((field) => ({
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
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.UserWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      // admin: true,
    },
  });

  const total = await prisma.user.count({
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
};

// delete a user from the database
const deleteUserFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  if (user.role === "ADMIN") {
    throw new Error("You can not delete an admin user");
  }
  const result = await prisma.user.delete({ where: { id: userId } });
  return result;
};

// change the status of a user
const changeProfileStatus = async (
  id: string,
  payload: { role?: Role; status?: UserStatus }
) => {
  // Check if user exists
  const isExist = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // If a role change is requested
  if (payload.role) {
    // Update the role in the user table
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        role: payload.role,
      },
    });

    // Delete the user record from the current role-specific table
    const roleModels = {
      [Role.ADMIN]: "admin",
      [Role.CUSTOMER]: "customer",
      [Role.VENDOR]: "vendor",
    };

    const currentRole = isExist.role;
    if (currentRole && currentRole !== Role.SUPER_ADMIN && roleModels[currentRole]) {
      const modelName = roleModels[currentRole as keyof typeof roleModels] as keyof typeof prisma;
      await (prisma[modelName as keyof typeof prisma] as any).delete({
        where: {
          email: isExist.email,
        },
      });
    }

    // Add the user to the new role-specific table
    const newRoleModel = roleModels[payload.role as keyof typeof roleModels];
    if (newRoleModel) {
      await (prisma[newRoleModel as keyof typeof prisma] as any).create({
        data: {
          name: isExist.name,
          email: isExist.email,
        },
      });
    }
  }

  // If only status change is requested
  if (payload.status) {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        status: payload.status,
      },
    });
  }

  return {
    message: "User updated successfully",
  };
};
// get a single user from the database
const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
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

  if (userInfo.role === Role.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        user: true,
      },
    });
  } else if (userInfo.role === Role.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        user: true,
      },
    });
  } else if (userInfo.role === Role.CUSTOMER) {
    profileInfo = await prisma.customer.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        user: true,
      },
    });
  } else if (userInfo.role === Role.VENDOR) {
    profileInfo = await prisma.vendor.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        user: true,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};
const updateMyProfile = async (user: IAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const { profilePhoto } = req.file as any;
  if (profilePhoto) {
    const uploadToCloudinary = await sendImageToCloudinary(
      profilePhoto.originalname,
      profilePhoto.path
    );
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let profileInfo;

  if (userInfo.role === Role.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body as Admin | {},
    });
  } else if (userInfo.role === Role.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body as Admin | {},
    });
  } else if (userInfo.role === Role.VENDOR) {
    profileInfo = await prisma.vendor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body as Vendor | {},
    });
  } else if (userInfo.role === Role.CUSTOMER) {
    profileInfo = await prisma.customer.update({
      where: {
        email: userInfo.email,
      },
      data: req.body as Customer | {},
    });
  }

  return { ...profileInfo };
};
export const UserServices = {
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
