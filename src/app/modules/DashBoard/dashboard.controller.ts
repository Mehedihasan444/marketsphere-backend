import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { DashboardServices } from "./dashboard.service";

const getAdminDashboardData = catchAsync(async (req, res) => {
  const { email } = req.user;
  
  // Get admin by email
  const admin = await require("../../config/prisma").default.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "Admin not found",
      data: null,
    });
  }

  const result = await DashboardServices.getAdminDashboardData(admin.id);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin dashboard data fetched successfully",
    data: result,
  });
});

const getVendorDashboardData = catchAsync(async (req, res) => {
  const { email } = req.user;
  
  // Get vendor by email
  const vendor = await require("../../config/prisma").default.vendor.findUnique({
    where: { email },
  });

  if (!vendor) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "Vendor not found",
      data: null,
    });
  }

  const result = await DashboardServices.getVendorDashboardData(vendor.id);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor dashboard data fetched successfully",
    data: result,
  });
});

const getCustomerDashboardData = catchAsync(async (req, res) => {
  const { email } = req.user;
  
  // Get customer by email
  const customer = await require("../../config/prisma").default.customer.findUnique({
    where: { email },
  });

  if (!customer) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "Customer not found",
      data: null,
    });
  }

  const result = await DashboardServices.getCustomerDashboardData(customer.id);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer dashboard data fetched successfully",
    data: result,
  });
});

export const DashboardControllers = {
  getAdminDashboardData,
  getCustomerDashboardData,
  getVendorDashboardData,
};
