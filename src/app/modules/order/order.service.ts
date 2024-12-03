import { Order, OrderItem, Prisma, Role } from "@prisma/client";
import prisma from "../../config/prisma";
import { paginationHelper } from "../../utils/paginationHelper";

const createOrder = async (payload: Order & { orderItems: OrderItem[] }) => {
  return await prisma.$transaction(async (transactionClient) => {
    const orderData = {
      customerId: payload.customerId,
      shopId: payload.shopId,
      quantity: payload.quantity,
      totalAmount: payload.totalAmount,
      discount: payload.discount,
      orderNumber: payload.orderNumber,
    };

    const order = await transactionClient.order.create({
      data: orderData,
    });

    payload.orderItems.forEach(async (item) => {
      await transactionClient.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: payload.quantity,
        },
      });
    });
  });
};

const getAllOrdersFromDB = async (
  params: any,
  options: any,
  userEmail: string
) => {
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

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: userEmail },
  });

  if (user.role === Role.CUSTOMER) {
    const customer = await prisma.customer.findUniqueOrThrow({
      where: { userId: user.id },
    });
    whereConditions.customerId = customer.id;
  } else if (user.role === Role.VENDOR) {
    await prisma.$transaction(async (transactionClient) => {
      const vendor = await transactionClient.vendor.findUniqueOrThrow({
        where: { userId: user.id },
      });
      const shop = await transactionClient.shop.findUniqueOrThrow({
        where: { vendorId: vendor.id },
      });

      whereConditions.shopId = shop.id;
    });
  }

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
  await prisma.order.findUniqueOrThrow({
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
  await prisma.order.findUniqueOrThrow({
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
