import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { paginationHelper } from "../../utils/paginationHelper";

const createCategory = async (payload: Prisma.CategoryCreateInput) => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategoriesFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.CategoryWhereInput[] = [];

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

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.category.findMany({
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
  });

  const total = await prisma.category.count({
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

const getSingleCategoryFromDB = async (id: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  return category;
};

const deleteCategoryFromDB = async (categoryId: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
  });

  const result = await prisma.category.delete({
    where: { id: categoryId },
  });
  return result;
};

const updateCategory = async (
  categoryId: string,
  payload: Prisma.CategoryUpdateInput
) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
  });

  const result = await prisma.category.update({
    where: { id: categoryId },
    data: payload,
  });
  return result;
};

export const CategoryServices = {
  createCategory,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  deleteCategoryFromDB,
  updateCategory,
};