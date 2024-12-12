import { Shop } from "@prisma/client";
import prisma from "../../config/prisma";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

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

const getAllShopsFromDB = async () => {
  const shops = await prisma.shop.findMany({
    include: {
      vendor: true,
    },
  });
  return shops;
};

const getSingleShopFromDB = async (id: string) => {
  const shop = await prisma.shop.findUniqueOrThrow({
    where: {
      id: id,
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

const updateShopInDB = async (id: string, payload: Partial<Shop>,images:any) => {
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

export const ShopServices = {
  createShopIntoDB,
  getAllShopsFromDB,
  getSingleShopFromDB,
  deleteShopFromDB,
  updateShopInDB,
};
