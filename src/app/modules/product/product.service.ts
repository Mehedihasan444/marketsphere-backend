import { Prisma, Product } from "@prisma/client";
import prisma from "../../config/prisma";
import { paginationHelper } from "../../utils/paginationHelper";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const createProduct = async (files: any, payload: Product) => {
  if (files) {
    const images = files;
    const imageUrls = await Promise.all(
      images?.map(async (image: any) => {
        const imageName = image?.originalname;
        const path = image?.path;
        const { secure_url } = await sendImageToCloudinary(imageName, path);
        return secure_url as string;
      })
    );
    payload.images = imageUrls;
  }
  const result = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: { ...payload },
    });
    await tx.review.create({
      data: {
        shopId: product.shopId,
        productId: product.id,
      },
    });

    return product;
  });

  return result;
};

const getAllProductsFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.ProductWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { category: { name: { contains: searchTerm, mode: "insensitive" } } }
      ],
    });
  }
  if (filterData.category) {
    andConditions.push({
      category: {
        name: {
          equals: filterData.category,
          mode: "insensitive",
        },
      },
    });
    delete filterData.category;
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

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
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
      category: true,
      shop: true,
      cartItems: true,
      orderItems: true,
      reviews: true,
    },
  });

  const total = await prisma.product.count({
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

const getAllVendorProducts = async (params: any, options: any, user: any) => {
  // Calculate pagination details
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  // Extract searchTerm and other filter data
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.ProductWhereInput[] = [];

  // Search products by name, description, or category name
  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { category: { name: { contains: searchTerm, mode: "insensitive" } } },
      ],
    });
  }

  // Filter products by category name
  if (filterData.category) {
    andConditions.push({
      category: {
        name: {
          equals: filterData.category,
          mode: "insensitive",
        },
      },
    });
    delete filterData.category; // Remove 'category' from filterData as it's already processed
  }

  // Add any remaining filters (e.g., filtering by price, stock, etc.)
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // Fetch the vendor and their associated shops
  const vendor = await prisma.vendor.findUnique({
    where: { email: user.email },
    include: { shop: true }, // Include shops associated with the vendor
  });

  // Ensure vendor and shops exist
  if (!vendor || !vendor.shop || vendor.shop.length === 0) {
    throw new Error("No shops found for the vendor");
  }

  // Extract shop IDs
  const shopIds = vendor.shop.map((shop) => shop.id);

  // Add a condition to filter products by shop IDs
  andConditions.push({
    shopId: {
      in: shopIds, // Use `in` for matching multiple shop IDs
    },
  });

  // Combine all conditions
  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch products with pagination, sorting, and relationships
  const result = await prisma.product.findMany({
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
      category: true,
      shop: true,
      cartItems: true,
      orderItems: true,
      reviews: true,
    },
  });

  // Get the total count of products matching the conditions
  const total = await prisma.product.count({
    where: whereConditions,
  });

  // Return paginated data
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleProductFromDB = async (id: string) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: { id },
    include: {
      category: true,
      shop: true,
      cartItems: true,
      orderItems: true,
      reviews: true,
    },
  });

  return product;
};

const deleteProductFromDB = async (productId: string) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });

  if (product.isDeleted) {
    throw new Error("This product is already marked as deleted.");
  }

  const result = await prisma.product.update({
    where: { id: productId },
    data: { isDeleted: true },
  });
  return result;
};

const updateProduct = async (
  productId: string,
  payload: Prisma.ProductUpdateInput
) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });

  const result = await prisma.product.update({
    where: { id: productId },
    data: payload,
  });
  return result;
};

export const ProductServices = {
  createProduct,
  getAllProductsFromDB,
  getSingleProductFromDB,
  deleteProductFromDB,
  updateProduct,
  getAllVendorProducts
};
