import { Shop } from "@prisma/client";
import prisma from "../../config/prisma";


const createShopIntoDB = async (payload:Shop) => {

  const shop = await prisma.shop.create({
    data:payload
  })
  return shop;
};

const getAllShopsFromDB = async () => {
  const shops = await prisma.shop.findMany()
  return shops;
};

const getSingleShopFromDB = async (id:string) => {
  const shop = await prisma.shop.findUniqueOrThrow({
    where: {
      id: id
    }
  })
  return shop;
};

const deleteShopFromDB = async (id:string) => {
   await prisma.shop.findUniqueOrThrow({
    where: {
      id: id
    }
  })
  const shop = await prisma.shop.delete({
    where: {
      id: id
    }
  })
  return shop;
};

const updateShopInDB = async (id:string, payload:Partial<Shop>) => {
  await prisma.shop.findUniqueOrThrow({
    where: {
      id: id
    }
  })
  const shop = await prisma.shop.update({
    where: {
      id: id
    },
    data: payload
  })
  return;
};

export const ShopServices = {
    createShopIntoDB,
  getAllShopsFromDB,
  getSingleShopFromDB,
  deleteShopFromDB,
  updateShopInDB,
};
