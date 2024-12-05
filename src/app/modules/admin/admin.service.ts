import { Admin, Customer, Prisma, PrismaClient, Role } from "@prisma/client";
import { paginationHelper } from "../../utils/paginationHelper";
import prisma from "../../config/prisma";
import { AdminSearchableFields } from "./admin.constant";

//  Get all Admin from the database
const getAllAdminFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andCondions: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: AdminSearchableFields.map((field) => ({
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

  const whereConditons: Prisma.AdminWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.admin.findMany({
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
      email: true,
      user: true,
    },
  });

  const total = await prisma.admin.count({
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

const getSingleAdminFromDB = async (id: string) => {
  const Admin = await prisma.admin.findUniqueOrThrow({ where: { id } ,include: { user: true }});
  return Admin;
};

//  Delete a customer from the database
const deleteAdminFromDB = async (adminId: string) => {
    const admin = await prisma.admin.findUniqueOrThrow({ where: { id:adminId } ,include: { user: true }});

  if (admin.user.role !== Role.ADMIN) {
    throw new Error("You cannot delete an admin user");
  }

  const result = await prisma.admin.delete({ where: { id: adminId } });
  return result;
};

const updateAdmin = async (
  adminId: string,
  payload: Partial<Admin>
) => {
  await prisma.admin.findUniqueOrThrow({
    where: { id: adminId },
  });

  const result = await prisma.admin.update({
    where: { id: adminId },
    data: payload,
  });
  return result;
};
export const AdminServices = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  deleteAdminFromDB,
  updateAdmin,
};
