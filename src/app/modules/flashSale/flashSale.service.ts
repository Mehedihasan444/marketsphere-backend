import { FlashSale, Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { IAuthUser } from "../user/user.constant";
import AppError from "../../errors/AppError";
import { paginationHelper } from "../../utils/paginationHelper";

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
  return result;
}

const getProductsInFlashSale = async (params: any, options: any) => {
  console.log(params)
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  // Build filter conditions for products
  const { searchTerm, minPrice, maxPrice, brand, rating, sortBy, sortOrder, ...filterData } = params;
  const productAndConditions: Prisma.ProductWhereInput[] = [
    { isDeleted: false }
  ];

  // Search term filter
  if (searchTerm) {
    productAndConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceCondition: any = {};
    if (minPrice !== undefined) priceCondition.gte = parseFloat(minPrice);
    if (maxPrice !== undefined) priceCondition.lte = parseFloat(maxPrice);
    productAndConditions.push({ price: priceCondition });
  }

  // Brand filter
  if (brand) {
    const brands = Array.isArray(brand) ? brand : [brand];
    productAndConditions.push({
      brand: {
        in: brands,
        mode: 'insensitive'
      }
    });
  }

  // Rating filter
  if (rating) {
    productAndConditions.push({
      rating: {
        gte: parseFloat(rating)
      }
    });
  }

  // Additional filters
  if (Object.keys(filterData).length > 0) {
    productAndConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const productWhereConditions: Prisma.ProductWhereInput =
    productAndConditions.length > 0 ? { AND: productAndConditions } : {};

  // Determine sorting for flashSaleItems
  let orderBy: any = { createdAt: 'desc' }; // Default sort

  if (sortBy) {
    switch (sortBy) {
      case 'price-low':
        orderBy = { product: { price: 'asc' } };
        break;
      case 'price-high':
        orderBy = { product: { price: 'desc' } };
        break;
      case 'rating':
        orderBy = { product: { rating: 'desc' } };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'discount':
        orderBy = { discount: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
  }

  // Get current active flash sales
  const now = new Date();
  
  // Fetch flash sale items with product filters
  const flashSaleItems = await prisma.flashSaleItem.findMany({
    where: {
      flashSale: {
        isDeleted: false,
        startDateTime: { lte: now },
        endDateTime: { gte: now }
      },
      product: productWhereConditions
    },
    skip,
    take: limit,
    orderBy,
    include: {
      product: {
        include: {
          shop: {
            select: {
              id: true,
              name: true,
              logo: true,
            }
          },
          category: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      },
      flashSale: {
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          startDateTime: true,
          endDateTime: true,
        }
      }
    }
  });

  // Count total flash sale items matching the criteria
  const total = await prisma.flashSaleItem.count({
    where: {
      flashSale: {
        isDeleted: false,
        startDateTime: { lte: now },
        endDateTime: { gte: now }
      },
      product: productWhereConditions
    },
  });

  // Get available brands from products in flash sales
  const flashSaleProducts = await prisma.flashSaleItem.findMany({
    where: {
      flashSale: {
        isDeleted: false,
        startDateTime: { lte: now },
        endDateTime: { gte: now }
      },
      product: {
        isDeleted: false
      }
    },
    select: {
      product: {
        select: {
          brand: true
        }
      }
    },
    distinct: ['productId'],
  });

  const availableBrands = flashSaleProducts
    .map(item => item.product.brand)
    .filter((brand): brand is string => brand !== null && brand !== undefined)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Get price range from products in flash sales
  const priceRangeProducts = await prisma.flashSaleItem.findMany({
    where: {
      flashSale: {
        isDeleted: false,
        startDateTime: { lte: now },
        endDateTime: { gte: now }
      },
      product: {
        isDeleted: false
      }
    },
    select: {
      product: {
        select: {
          price: true
        }
      }
    }
  });

  const prices = priceRangeProducts.map(item => item.product.price);
  const minPriceValue = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPriceValue = prices.length > 0 ? Math.max(...prices) : 10000;

  // Transform data to include discounted prices
  const transformedData = flashSaleItems.map(item => ({
    ...item.product,
    originalPrice: item.product.price,
    discountedPrice: item.product.price - (item.product.price * item.discount / 100),
    flashSaleDiscount: item.discount,
    flashSale: item.flashSale,
  }));


  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    filters: {
      brands: availableBrands,
      priceRange: {
        min: minPriceValue,
        max: maxPriceValue,
      }
    },
    data: transformedData,
  };
};

export default getProductsInFlashSale;



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
