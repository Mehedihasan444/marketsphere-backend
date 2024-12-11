import { Prisma, Review, Role } from "@prisma/client";
import prisma from "../../config/prisma";
import { paginationHelper } from "../../utils/paginationHelper";

const createReview = async (payload: Review) => {
  const result = await prisma.review.create({
    data: payload,
  });
  return result;
};

const getAllReviewsFromDB = async (
  params: any,
  options: any,
  userEmail: string
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.ReviewWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [{ comment: { contains: searchTerm, mode: "insensitive" } }],
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

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: userEmail },
  });

  if (user.role === Role.CUSTOMER) {
    const customer = await prisma.customer.findUniqueOrThrow({
      where: { email: user.email },
    });
    whereConditions.customerId = customer.id;
  } else if (user.role === Role.VENDOR) {
    await prisma.$transaction(async (transactionClient) => {
      const vendor = await transactionClient.vendor.findUniqueOrThrow({
        where: { email: user.email },
      });
      const shop = await transactionClient.shop.findUniqueOrThrow({
        where: { vendorId: vendor.id },
      });

      whereConditions.shopId = shop.id;
    });
  }

  const result = await prisma.review.findMany({
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

  const total = await prisma.review.count({
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

const getProductReviews = async (id: string) => {
  const Review = await prisma.review.findFirstOrThrow({
    where: { productId: id },
    include: {
      product: true,
    },
  });

  return Review;
};
const getSingleReviewFromDB = async (id: string) => {
  const Review = await prisma.review.findUniqueOrThrow({
    where: { id },
  });

  return Review;
};

const deleteReviewFromDB = async (ReviewId: string) => {
  await prisma.review.findUniqueOrThrow({
    where: { id: ReviewId },
  });

  const result = await prisma.review.delete({
    where: { id: ReviewId },
  });
  return result;
};

const updateReview = async (
  ReviewId: string,
  payload: Prisma.ReviewUpdateInput
) => {
  await prisma.review.findUniqueOrThrow({
    where: { id: ReviewId },
  });

  const result = await prisma.review.update({
    where: { id: ReviewId },
    data: payload,
  });
  return result;
};

export const ReviewServices = {
  createReview,
  getAllReviewsFromDB,
  getSingleReviewFromDB,
  deleteReviewFromDB,
  updateReview,
  getProductReviews,
};
