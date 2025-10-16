import { Category, Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { paginationHelper } from "../../utils/paginationHelper";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const createCategory = async (file: any, payload: Category) => {
  if (file) {
    const image = await sendImageToCloudinary(
      file.originalname,
      file.path
    );
    payload.image = image.secure_url as string;
  }
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategoriesFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.CategoryWhereInput[] = [];

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

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.category.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      parent: true,
      children: true,
      _count: {
        select: {
          products: true,
        }
      }
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
          [options.sortBy]: options.sortOrder,
        }
        : {
          createdAt: "desc",
        },
  });

  const total = await prisma.category.count({
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

const getSingleCategoryFromDB = async (id: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  return category;
};

const deleteCategoryFromDB = async (categoryId: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
  });

  const result = await prisma.category.delete({
    where: { id: categoryId },
  });
  return result;
};

const updateCategory = async (
  categoryId: string,
  payload: Category,
  image: any
) => {

  const category = await prisma.category.findFirstOrThrow({
    where: { id: categoryId },
  });
  if (image) {
    const img = await sendImageToCloudinary(
      image.originalname,
      image.path
    );
    payload.image = img.secure_url as string;
  }
  const result = await prisma.category.update({
    where: { id: category.id },
    data: payload,
  });
  return result;
};

// Get category by slug (URL-friendly name)
const getCategoryBySlug = async (slug: string) => {
  // Convert slug back to category name (e.g., "mobile-phones" -> "Mobile Phones")
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const category = await prisma.category.findFirst({
    where: { 
      name: {
        equals: categoryName,
        mode: 'insensitive'
      }
    },
    include: {
      _count: {
        select: {
          products: true,
        }
      }
    }
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return {
    ...category,
    productCount: category._count.products,
    slug: category.name.toLowerCase().replace(/\s+/g, '-'),
  };
};

// Get products by category slug with advanced filtering
const getProductsByCategorySlug = async (slug: string, params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  // Convert slug to category name
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Find category
  const category = await prisma.category.findFirst({
    where: { 
      name: {
        equals: categoryName,
        mode: 'insensitive'
      }
    }
  });

  if (!category) {
    throw new Error('Category not found');
  }

  // Build filter conditions
  const { searchTerm, minPrice, maxPrice, brand, rating, sortBy, sortOrder, ...filterData } = params;
  const andConditions: Prisma.ProductWhereInput[] = [
    { categoryId: category.id },
    { isDeleted: false }
  ];

  // Search term filter
  if (searchTerm) {
    andConditions.push({
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
    andConditions.push({ price: priceCondition });
  }

  // Brand filter
  if (brand) {
    const brands = Array.isArray(brand) ? brand : [brand];
    andConditions.push({
      brand: {
        in: brands,
        mode: 'insensitive'
      }
    });
  }

  // Rating filter
  if (rating) {
    andConditions.push({
      rating: {
        gte: parseFloat(rating)
      }
    });
  }

  // Additional filters
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

  // Determine sorting
  let orderBy: any = { createdAt: 'desc' }; // Default sort

  if (sortBy) {
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'popularity':
        orderBy = { cartItems: { _count: 'desc' } };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { [sortBy]: sortOrder || 'desc' };
    }
  }

  // Fetch products
  const products = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          description: true,
        }
      },
      shop: {
        select: {
          id: true,
          name: true,
          logo: true,
        }
      }
    }
  });

  const total = await prisma.product.count({
    where: whereConditions,
  });

  // Get available brands for filter
  const availableBrands = await prisma.product.findMany({
    where: { categoryId: category.id, isDeleted: false },
    select: { brand: true },
    distinct: ['brand'],
  });

  // Get price range
  const priceRange = await prisma.product.aggregate({
    where: { categoryId: category.id, isDeleted: false },
    _min: { price: true },
    _max: { price: true },
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    category: {
      id: category.id,
      name: category.name,
      slug: slug,
    },
    filters: {
      brands: availableBrands
        .filter(p => p.brand)
        .map(p => p.brand)
        .filter((value, index, self) => self.indexOf(value) === index),
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 10000,
      }
    },
    data: products,
  };
};

// Get category statistics
const getCategoryStats = async () => {
  const categories = await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      products: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
        }
      }
    }
  });

  const stats = categories.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.name.toLowerCase().replace(/\s+/g, '-'),
    image: category.image,
    description: category.description,
    productCount: category.products.length,
    createdAt: category.createdAt,
  }));

  const totalProducts = stats.reduce((sum, cat) => sum + cat.productCount, 0);

  return {
    totalCategories: categories.length,
    totalProducts,
    categories: stats,
  };
};

export const CategoryServices = {
  createCategory,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  deleteCategoryFromDB,
  updateCategory,
  getCategoryBySlug,
  getProductsByCategorySlug,
  getCategoryStats,
};
