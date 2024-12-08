import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { VendorFilterableFields } from "./vendor.constant";
import { VendorServices } from "./vendor.service";

const getAllVendors = catchAsync(async (req, res) => {
  const filters = pick(req.query, VendorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const vendors = await VendorServices.getAllVendorsFromDB(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendors Retrieved Successfully",
    data: vendors,
  });
});

const getSingleVendor = catchAsync(async (req, res) => {
  const vendor = await VendorServices.getSingleVendorFromDB(req.params.email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor Retrieved Successfully",
    data: vendor,
  });
});

const deleteVendor = catchAsync(async (req, res) => {
  const { id } = req.params;
  await VendorServices.deleteVendorFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor deleted successfully",
    data: null,
  });
});

const updateVendor = catchAsync(async (req, res) => {
  await VendorServices.updateVendor(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor updated successfully",
    data: null,
  });
});

export const VendorControllers = {
  getAllVendors,
  getSingleVendor,
  deleteVendor,
  updateVendor,
};
