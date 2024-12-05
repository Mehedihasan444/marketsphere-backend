import { FlashSale } from "@prisma/client";
import prisma from "../../config/prisma";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const createFlashSale = async (file: any, payload: FlashSale) => {
  if (file) {
    const image = await sendImageToCloudinary(
      file.image.originalname,
      file.image.path
    );
    payload.image = image.secure_url as string;
  }
  const flashSale = await prisma.flashSale.create({ data: payload });
  return flashSale;
};
const getAllFlashSales = async () => {
  const flashSales = await prisma.flashSale.findMany();
  return flashSales;
};
const getSingleFlashSale = async (id: string) => {
  const flashSale = await prisma.flashSale.findUniqueOrThrow({ where: { id } });
};
const deleteFlashSale = async (id: string) => {
  await prisma.flashSale.findUniqueOrThrow({ where: { id } });
  const flashSale = await prisma.flashSale.delete({ where: { id } });
  return flashSale;
};

export const FlashSaleServices = {
  createFlashSale,
  getAllFlashSales,
  getSingleFlashSale,
  deleteFlashSale,
};
