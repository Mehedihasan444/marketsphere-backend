import { Prisma, Shop, ShopStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { paginationHelper } from "../../utils/paginationHelper";

const createShopIntoDB = async (payload: Shop, images: any) => {
  if (images?.logo) {
    const image = await sendImageToCloudinary(
      images.logo[0].originalname,
      images.logo[0].path
    );
    payload.logo = image.secure_url as string;
  }
  if (images?.banner) {
    const image = await sendImageToCloudinary(
      images.banner[0].originalname,
      images.banner[0].path
    );
    payload.banner = image.secure_url as string;
  }
  const shop = await prisma.shop.create({
    data: payload,
  });
  return shop;
};

const getAllShopsFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.ShopWhereInput[] = [];

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

  const whereConditions: Prisma.ShopWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.shop.findMany({
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
      vendor: true,
    },
  });

  const total = await prisma.shop.count({
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

const getSingleShopFromDB = async (id: string) => {
  const shop = await prisma.shop.findUniqueOrThrow({
    where: {
      id: id,
    }, include: {
      vendor: true,
      products: true,
      followers: true,
      reviews: true,
      order: true,
      coupon: true,
    },
  });
  return shop;
};

const deleteShopFromDB = async (id: string) => {
  await prisma.shop.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  const shop = await prisma.shop.delete({
    where: {
      id: id,
    },
  });
  return shop;
};

const updateShopInDB = async (id: string, payload: Partial<Shop>, images: any) => {
  await prisma.shop.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  if (images?.logo) {
    const image = await sendImageToCloudinary(
      images.logo[0].originalname,
      images.logo[0].path
    );
    payload.logo = image.secure_url as string;
  }
  if (images?.banner) {
    const image = await sendImageToCloudinary(
      images.banner[0].originalname,
      images.banner[0].path
    );
    payload.banner = image.secure_url as string;
  }
  const shop = await prisma.shop.update({
    where: {
      id: id,
    },
    data: payload,
  });
  return;
};

const updateShopStatus = async (id: string, payload: any) => {
  await prisma.shop.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  const shop = await prisma.shop.update({
    where: {
      id: id,
    },
    data: { status: payload.shopStatus },
  });
  return shop;
}
export const ShopServices = {
  createShopIntoDB,
  getAllShopsFromDB,
  getSingleShopFromDB,
  deleteShopFromDB,
  updateShopInDB,
  updateShopStatus
};
