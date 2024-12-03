import { FlashSale } from "@prisma/client";
import prisma from "../../config/prisma";

const createFlashSale = async (payload: FlashSale) => {
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
  deleteFlashSale
};
