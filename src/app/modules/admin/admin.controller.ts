import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { AdminFilterableFields } from "./admin.constant";
import { AdminServices } from "./admin.service";


const getAllAdmins = catchAsync(async (req, res) => {
  const filters = pick(req.query, AdminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const admins = await AdminServices.getAllAdminFromDB(
    filters,
    options
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin Retrieved Successfully",
    data: admins,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const admin = await AdminServices.getSingleAdminFromDB(
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin Retrieved Successfully",
    data: admin,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AdminServices.deleteAdminFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin deleted successfully",
    data: null,
  });
});
const updateAdmin = catchAsync(async (req, res) => {
  await AdminServices.updateAdmin(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin updated successfully",
    data: null,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
};
