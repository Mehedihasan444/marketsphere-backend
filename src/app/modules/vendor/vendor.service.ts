import { Vendor, Prisma, PrismaClient, Role } from "@prisma/client";
import { paginationHelper } from "../../utils/paginationHelper";
import prisma from "../../config/prisma";
import { VendorSearchableFields } from "./vendor.constant";

// Get all Vendors from the database
const getAllVendorsFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.VendorWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: VendorSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.VendorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.vendor.findMany({
    where: whereConditions,
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
      user: true,
      // shop: true,
    },
  });

  const total = await prisma.vendor.count({
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
};

// Get a single Vendor from the database
const getSingleVendorFromDB = async (id: string) => {
  const vendor = await prisma.vendor.findUniqueOrThrow({
    where: { id },
    include: {
      user: true,
      // shop: true
    },
  });
  return vendor;
};

// Delete a Vendor from the database
const deleteVendorFromDB = async (vendorId: string) => {
  const vendor = await prisma.vendor.findUniqueOrThrow({
    where: { id: vendorId },
    include: { user: true },
  });

  if (vendor.user.role !== Role.VENDOR) {
    throw new Error("You cannot delete a non-vendor user");
  }

  const result = await prisma.vendor.delete({ where: { id: vendorId } });
  return result;
};

// Update a Vendor in the database
const updateVendor = async (vendorId: string, payload: Partial<Vendor>) => {
  await prisma.vendor.findUniqueOrThrow({
    where: { id: vendorId },
  });

  const result = await prisma.vendor.update({
    where: { id: vendorId },
    data: payload,
  });
  return result;
};

export const VendorServices = {
  getAllVendorsFromDB,
  getSingleVendorFromDB,
  deleteVendorFromDB,
  updateVendor,
};
