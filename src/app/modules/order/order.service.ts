import { Order, OrderItem, Prisma, Role } from "@prisma/client";
import prisma from "../../config/prisma";
import { paginationHelper } from "../../utils/paginationHelper";

const createOrder = async (payload: Order & { orderItems: OrderItem[] }) => {
  const productId = payload.orderItems[0].productId
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId
    }
  })
  const shopId = product.shopId
  const shop = await prisma.shop.findUniqueOrThrow({
    where: {
      id: shopId
    }
  })
  const vendorId = shop.vendorId
  payload.vendorId = vendorId
  payload.shopId = shopId
  const order = await prisma.$transaction(async (transactionClient) => {

    const { orderItems, ...orderData } = payload;
    const order = await transactionClient.order.create({
      data: orderData,
    });

    orderItems.forEach(async (item) => {
      await transactionClient.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: payload.quantity,
        },
      });
    });
    const cart=await transactionClient.cart.findFirstOrThrow({
      where: {
        customerId: order.customerId
      }
    })
    await transactionClient.cartItem.deleteMany({
      where: {
        cartId: cart.id
      }

    });
    await transactionClient.product.updateMany({
      where: {
        id: {
          in: orderItems.map((item) => item.productId),
        },
      },
      data: {
        quantity: {
          decrement: orderItems.reduce((total, item) => total + item.quantity, 0),
        },
      },
    })
  });
  console.log(order)
  return order;
};

const getAllOrdersFromDB = async (
  params: any,
  options: any,
  userEmail: string
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm,isReview, ...filterData } = params;
  if(isReview){
    isReview==="true"?filterData.isReview=true:filterData.isReview=false
  }
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
      where: { email: user.email },
    });
    whereConditions.customerId = customer.id;
  } else if (user.role === Role.VENDOR) {
    await prisma.$transaction(async (transactionClient) => {
      const vendor = await transactionClient.vendor.findFirstOrThrow({
        where: { email: user.email },
      });
      // const shop = await transactionClient.shop.findFirstOrThrow({
      //   where: { vendorId: vendor.id },
      // });

      whereConditions.vendorId = vendor.id;
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
      orderItems: {
        include: {
          product: {
            include: {
              shop: true,
              reviews:  true
            },
          },
        },
      },
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
      orderItems: {
        include: {
          product: true,
        },
      },
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
