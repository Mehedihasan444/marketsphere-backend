import { FlashSale } from "@prisma/client";
import prisma from "../../config/prisma";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { IAuthUser } from "../user/user.constant";
import AppError from "../../errors/AppError";

const createFlashSale = async (file: any, payload: FlashSale) => {
  if (file) {
    const image = await sendImageToCloudinary(
      file.originalname,
      file.path
    );
    payload.image = image.secure_url as string;
  }
  const flashSale = await prisma.flashSale.create({ data: payload });
  return flashSale;
};
const addProductToFlashSale = async (data: any) => {
  const flashSale = await prisma.flashSale.findUniqueOrThrow({
    where: { id: data.flashSaleId },
  });
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: data.productId },
  });
  await prisma.flashSaleItem.create({
    data: {
      flashSaleId: flashSale.id,
      productId: product.id,
      discount: data.discount,
    },
  });
  return flashSale;
};
const deleteProductToFlashSale = async (id: string) => {
  const flashSaleItem = await prisma.flashSaleItem.findUniqueOrThrow({
    where: { id },
  });
  await prisma.flashSaleItem.delete({ where: { id } });
  return flashSaleItem;
}
const getAllFlashSales = async () => {
  const flashSales = await prisma.flashSale.findMany();

  return flashSales;
};
const getSingleFlashSale = async (id: string) => {
  const flashSale = await prisma.flashSale.findUnique({
    where: {
      id: id
    },
    include: {
      flashSaleItems: true
    }
  });

  if (!flashSale) {
    throw new AppError(404, 'Flash Sale not found');
  }

  return flashSale;
};

const updateFlashSale = async (id: string, data: FlashSale) => {
  await prisma.flashSale.findUniqueOrThrow({ where: { id } });
  const flashSale = await prisma.flashSale.update({
    where: { id },
    data,
  });
  return flashSale;
}
const deleteFlashSale = async (id: string) => {
  console.log(id)
  await prisma.flashSale.findUniqueOrThrow({ where: { id } });
  const flashSale = await prisma.flashSale.delete({ where: { id } });
  return flashSale;
};



const getVendorProductsInFlashSale = async (user: IAuthUser) => {

  // Fetch the vendor and their associated shops
  const vendor = await prisma.vendor.findUnique({
    where: { email: user?.email },
    include: { shop: true }, // Include shops associated with the vendor
  });

  // Ensure vendor and shops exist
  if (!vendor || !vendor.shop || vendor.shop.length === 0) {
    throw new Error("No shops found for the vendor");
  }

  // Extract shop IDs
  const shopIds = vendor.shop.map((shop) => shop.id);


  // Fetch products with pagination, sorting, and relationships
  const result = await prisma.flashSaleItem.findMany({
    where: {
      product: {
        shopId: {
          in: shopIds, // Use `in` for matching multiple shop IDs
        },
      },
    },
    include: {
      flashSale: true,
      product: true,
    },
  });
  console.log(result)
  return result;
}

const getProductsInFlashSale = async () => {
  const products = await prisma.flashSaleItem.findMany({
    include: {
      product: true,
      flashSale: true
    }
  });

  return products;
}
export const FlashSaleServices = {
  createFlashSale,
  getAllFlashSales,
  getSingleFlashSale,
  deleteFlashSale,
  addProductToFlashSale,
  updateFlashSale,
  deleteProductToFlashSale,
  getVendorProductsInFlashSale,
  getProductsInFlashSale
};
