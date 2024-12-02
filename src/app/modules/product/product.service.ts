import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { paginationHelper } from "../../utils/paginationHelper";

const createProduct = async (payload: Prisma.ProductCreateInput) => {
  const result = await prisma.product.create({
    data: payload,
  });
  return result;
};

const getAllProductsFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.ProductWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
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

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
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
    include: {
        category: true,
        shop: true,
    },
  });

  const total = await prisma.product.count({
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

const getSingleProductFromDB = async (id: string) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: { id },
  });

  return product;
};

const deleteProductFromDB = async (productId: string) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });

  if (product.isDeleted) {
    throw new Error("This product is already marked as deleted.");
  }

  const result = await prisma.product.update({
    where: { id: productId },
    data: { isDeleted: true },
  });
  return result;
};

const updateProduct = async (
  productId: string,
  payload: Prisma.ProductUpdateInput
) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });

  const result = await prisma.product.update({
    where: { id: productId },
    data: payload,
  });
  return result;
};

export const ProductServices = {
  createProduct,
  getAllProductsFromDB,
  getSingleProductFromDB,
  deleteProductFromDB,
  updateProduct,
};
