import { BecomeVendorRequest, Role, ShopStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
const InsertBecomeVendorRequest = async (payload: BecomeVendorRequest) => {
  const isExist = await prisma.becomeVendorRequest.findFirst({
    where: {
      email: payload.email,
    },
  });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "You already send a request!");
  }
  const becomeVendorRequest = await prisma.becomeVendorRequest.create({
    data: {
      ...payload,
    },
  });
  return becomeVendorRequest;
};

const getAllBecomeVendorRequests = async () => {
  const becomeVendorRequests = await prisma.becomeVendorRequest.findMany();
  return becomeVendorRequests;
};

const getSingleBecomeVendorRequest = async (BecomeVendorRequestId: string) => {
  const becomeVendorRequest = await prisma.becomeVendorRequest.findFirstOrThrow(
    {
      where: {
        id: BecomeVendorRequestId,
      },
    }
  );
  return becomeVendorRequest;
};

const deleteBecomeVendorRequest = async (BecomeVendorRequestId: string) => {
  await prisma.becomeVendorRequest.findFirstOrThrow({
    where: {
      id: BecomeVendorRequestId,
    },
  });
  const becomeVendorRequest = await prisma.becomeVendorRequest.delete({
    where: {
      id: BecomeVendorRequestId,
    },
  });
  return becomeVendorRequest;
};
const updateBecomeVendorRequest = async (
  BecomeVendorRequestId: string,
  status: {status:ShopStatus}
) => {

  const becomeVendorRequest = await prisma.becomeVendorRequest.findFirstOrThrow(
    {
      where: {
        id: BecomeVendorRequestId,
      },
    }
  );
  if (status.status === ShopStatus.REJECTED) {
     await prisma.becomeVendorRequest.update({
      where: {
        id: BecomeVendorRequestId,
      },
      data: status,
    });
  } else if (status.status === ShopStatus.APPROVED) {
     await prisma.$transaction(async (transactionClient) => {
      const updatedBecomeVendorRequest =
        await transactionClient.becomeVendorRequest.update({
          where: {
            id: BecomeVendorRequestId,
          },
          data: status,
        });

      // Update the user's role to VENDOR
      const user = await transactionClient.user.update({
        where: {
          email: becomeVendorRequest.email,
        },
        data: {
          role: Role.VENDOR,
        },
      });

      // Delete the customer record for this user
      await transactionClient.customer.delete({
        where: {
          email: user.email,
        },
      });

      // Create a new vendor record for this user
      await transactionClient.vendor.create({
        data: {
          name: user.name,
          email: user.email,
        },
      });

      // Return the updated request data
      return updatedBecomeVendorRequest;
    });
  }
  return becomeVendorRequest;
};

export const BecomeVendorRequestServices = {
  InsertBecomeVendorRequest,
  getAllBecomeVendorRequests,
  getSingleBecomeVendorRequest,
  deleteBecomeVendorRequest,
  updateBecomeVendorRequest,
};
