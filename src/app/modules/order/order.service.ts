import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { paginationHelper } from "../../utils/paginationHelper";

const createOrder = async (payload: Prisma.OrderCreateInput) => {
  const result = await prisma.order.create({
    data: payload,
  });
  return result;
};

const getAllOrdersFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.OrderWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { orderNumber: { contains: searchTerm, mode: "insensitive" } },
        {
          customer: {
            user: { name: { contains: searchTerm, mode: "insensitive" } },
          },
        },
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

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
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
      orderItems: true,
    },
  });

  const total = await prisma.order.count({
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

const getSingleOrderFromDB = async (id: string) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id },
    include: {
      customer: true,
      orderItems: true,
    },
  });

  return order;
};

const deleteOrderFromDB = async (orderId: string) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
  });

  const result = await prisma.order.delete({
    where: { id: orderId },
  });
  return result;
};

const updateOrder = async (
  orderId: string,
  payload: Prisma.OrderUpdateInput
) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
  });

  const result = await prisma.order.update({
    where: { id: orderId },
    data: payload,
  });
  return result;
};

export const OrderServices = {
  createOrder,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  deleteOrderFromDB,
  updateOrder,
};
