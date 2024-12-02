import { Customer, Prisma, PrismaClient, Role } from "@prisma/client";
import { paginationHelper } from "../../utils/paginationHelper";
import { CustomerSearchableFields } from "./customer.constant";
import prisma from "../../config/prisma";

//  Get all customers from the database
const getAllCustomersFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andCondions: Prisma.CustomerWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: CustomerSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.CustomerWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.customer.findMany({
    where: whereConditons,
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
    select: {
      userId: true,
      user: true,
    },
  });

  const total = await prisma.customer.count({
    where: whereConditons,
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

const getSingleCustomerFromDB = async (id: string) => {
  const customer = await prisma.customer.findUniqueOrThrow({ where: { id } ,include: { user: true }});
  return customer;
};

//  Delete a customer from the database
const deleteCustomerFromDB = async (customerId: string) => {
    const customer = await prisma.customer.findUniqueOrThrow({ where: { id:customerId } ,include: { user: true }});

  if (customer.user.role !== Role.ADMIN) {
    throw new Error("You cannot delete an customer user");
  }

  const result = await prisma.customer.delete({ where: { id: customerId } });
  return result;
};

const updateCustomer = async (
  customerId: string,
  payload: Partial<Customer>
) => {
  await prisma.customer.findUniqueOrThrow({
    where: { id: customerId },
  });

  const result = await prisma.customer.update({
    where: { id: customerId },
    data: payload,
  });
  return result;
};
export const CustomerServices = {
  getAllCustomersFromDB,
  getSingleCustomerFromDB,
  deleteCustomerFromDB,
  updateCustomer,
};
