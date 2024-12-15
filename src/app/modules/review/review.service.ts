import { Prisma, Review, ReviewItem, Role } from "@prisma/client";
import prisma from "../../config/prisma";
import { paginationHelper } from "../../utils/paginationHelper";

const createReview = async (payload: ReviewItem & { orderId: string }) => {

  const review = await prisma.$transaction(async (transactionClient) => {
    const { orderId, ...reviewData } = payload;
    const review = await transactionClient.reviewItem.create({
      data: reviewData
    });
    const result = await transactionClient.order.update({
      where: {
        id: payload.orderId
      },
      data: {
        isReview: true
      },
    });
    return review;
  })
  return review;
};

// const getAllReviewsFromDB = async (
//   params: any,
//   options: any,
//   userEmail: string
// ) => {
//   const { page, limit, skip } = paginationHelper.calculatePagination(options);

//   const { searchTerm, ...filterData } = params;
//   const andConditions: Prisma.ReviewItemWhereInput[] = [];

//   if (searchTerm) {
//     andConditions.push({
//       OR: [{ comment: { contains: searchTerm, mode: "insensitive" } }],
//     });
//   }

//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map((key) => ({
//         [key]: {
//           equals: (filterData as any)[key],
//         },
//       })),
//     });
//   }

//   let whereConditions: Prisma.ReviewItemWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};

//   const user = await prisma.user.findUniqueOrThrow({
//     where: { email: userEmail },
//   });

//   if (user.role === Role.CUSTOMER) {
//     const customer = await prisma.customer.findUniqueOrThrow({
//       where: { email: user.email },
//     });
//     whereConditions.customerId = customer.id;
//   } else if (user.role === Role.VENDOR) {
//     await prisma.$transaction(async (transactionClient) => {
//       const vendor = await transactionClient.vendor.findFirstOrThrow({
//         where: { email: user.email },
//       });
//       const shop = await transactionClient.shop.findMany({
//         where: { vendorId: vendor.id }, include: { vendor: true ,reviews:true},
//       });
//       // const review = await transactionClient.review.findFirstOrThrow({
//       //   where: { shopId: shop.id },
//       // });

//       // whereConditions.shopId = shop.map((shop) => shop.id);
//       const shopIds = shop.map((shop) => shop.id);

//       if (shopIds.length > 0) {
//         whereConditions = { ...whereConditions, shopId: { in: shopIds } };
//       } else {
//         // Handle case where vendor has no associated shops
//         whereConditions = { ...whereConditions, shopId: null };
//       }
//     });
//   }

//   const result = await prisma.reviewItem.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? {
//           [options.sortBy]: options.sortOrder,
//         }
//         : {
//           createdAt: "desc",
//         },include:{
//           customer:true,
//         }
//   });

//   const total = await prisma.reviewItem.count({
//     where: whereConditions,
//   });

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };
// const getAllReviewsFromDB = async (
//   params: any,
//   options: any,
//   userEmail: string
// ) => {
//   const { page, limit, skip } = paginationHelper.calculatePagination(options);

//   const { searchTerm, ...filterData } = params;
//   const andConditions: Prisma.ReviewItemWhereInput[] = [];

//   // Add searchTerm condition
//   if (searchTerm) {
//     andConditions.push({
//       OR: [{ comment: { contains: searchTerm, mode: "insensitive" } }],
//     });
//   }

//   // Add filter conditions dynamically
//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map((key) => ({
//         [key]: {
//           equals: (filterData as any)[key],
//         },
//       })),
//     });
//   }

//   // Initialize whereConditions
//   let whereConditions: Prisma.ReviewItemWhereInput& Prisma.ReviewWhereInput=
//     andConditions.length > 0 ? { AND: andConditions } : {};

//   // Find the user by email
//   const user = await prisma.user.findUniqueOrThrow({
//     where: { email: userEmail },
//   });

//   if (user.role === Role.CUSTOMER) {
//     // If user is a CUSTOMER, filter reviews by customerId
//     const customer = await prisma.customer.findUniqueOrThrow({
//       where: { email: user.email },
//     });
//     whereConditions = { ...whereConditions, customerId: customer.id };
//   } else if (user.role === Role.VENDOR) {
//     // If user is a VENDOR, filter reviews by shopId(s) associated with the vendor
//     const vendor = await prisma.vendor.findFirstOrThrow({
//       where: { email: user.email },
//     });

//     const shops = await prisma.shop.findMany({
//       where: { vendorId: vendor.id },
//       select: { id: true },
//     });

//     const shopIds = shops.map((shop) => shop.id);

//     if (shopIds.length > 0) {
//       whereConditions = { ...whereConditions, shopId: { in: shopIds } };
//     } else {
//       // Handle case where vendor has no associated shops
//       whereConditions = { ...whereConditions, shopId: undefined };
//     }
//   }

//   // Fetch paginated reviews
//   const result = await prisma.reviewItem.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? {
//             [options.sortBy]: options.sortOrder,
//           }
//         : {
//             createdAt: "desc",
//           },
//     include: {
//       customer: true,
//     },
//   });

//   // Get total count for pagination
//   const total = await prisma.reviewItem.count({
//     where: whereConditions,
//   });

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };
const getAllReviewsFromDB = async (
  params: any,
  options: any,
  userEmail: string
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.ReviewItemWhereInput[] = [];

  // Add searchTerm condition
  if (searchTerm) {
    andConditions.push({
      OR: [{ comment: { contains: searchTerm, mode: "insensitive" } }],
    });
  }

  // Add filter conditions dynamically
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // Initialize whereConditions
  let whereConditions: Prisma.ReviewItemWhereInput & Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Find the user by email
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: userEmail },
  });

  if (user.role === Role.CUSTOMER) {
    // If user is a CUSTOMER, filter reviews by customerId
    const customer = await prisma.customer.findUniqueOrThrow({
      where: { email: user.email },
    });
    whereConditions = { ...whereConditions, customerId: customer.id };
  } else if (user.role === Role.VENDOR) {
    // If user is a VENDOR, filter reviews by shopId(s) associated with the vendor
    const vendor = await prisma.vendor.findFirstOrThrow({
      where: { email: user.email },
    });

    const shops = await prisma.shop.findMany({
      where: { vendorId: vendor.id },
      select: { id: true },
    });

    const shopIds = shops.map((shop) => shop.id);

    if (shopIds.length > 0) {
      // Fetch all products for the vendor's shops
      const products = await prisma.product.findMany({
        where: { shopId: { in: shopIds } },
        select: { id: true },
      });

      const productIds = products.map((product) => product.id);

      // Now filter reviews based on the productIds via the Review model
      whereConditions = {
        ...whereConditions,
        review: {
          productId: { in: productIds },
        },
      };
    } else {
      // Handle case where vendor has no associated shops
      whereConditions = { ...whereConditions, review: { productId: undefined } };
    }
  }

  // Fetch paginated reviews
  const result = await prisma.reviewItem.findMany({
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
      customer: true,
    },
  });

  // Get total count for pagination
  const total = await prisma.reviewItem.count({
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

  const Review = await prisma.product.findFirstOrThrow({
    where: { id },
    include: {
      reviews: {
        include: {
          reviewItems: true
        }
      },
    },
  });

  return Review.reviews;

};
const getSingleReviewFromDB = async (id: string) => {
  const Review = await prisma.review.findUniqueOrThrow({
    where: { id },
  });

  return Review;
};

const deleteReviewFromDB = async (ReviewId: string) => {
  await prisma.reviewItem.findFirstOrThrow({
    where: { id: ReviewId },
  });

  const result = await prisma.reviewItem.delete({
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
