import { Category, Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { paginationHelper } from "../../utils/paginationHelper";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const createCategory = async (file: any, payload: Category) => {
  if (file) {
    const image = await sendImageToCloudinary(
      file.originalname,
      file.path
    );
    payload.image = image.secure_url as string;
  }
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
  payload: Category,
  image: any
) => {

  const category = await prisma.category.findFirstOrThrow({
    where: { id: categoryId },
  });
  if (image) {
    const img = await sendImageToCloudinary(
      image.originalname,
      image.path
    );
    payload.image = img.secure_url as string;
  }
  const result = await prisma.category.update({
    where: { id: category.id },
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
