import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { CategoryServices } from "./category.service";
import { CategoryFilterableFields } from "./category.constant";

const createCategory = catchAsync(async (req, res) => {
  const category = await CategoryServices.createCategory(req.file,req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category Created Successfully",
    data: category,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const filters = pick(req.query, CategoryFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const categories = await CategoryServices.getAllCategoriesFromDB(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories Retrieved Successfully",
    data: categories,
  });
});

const getSingleCategory = catchAsync(async (req, res) => {
  const category = await CategoryServices.getSingleCategoryFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category Retrieved Successfully",
    data: category,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CategoryServices.deleteCategoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category Deleted Successfully",
    data: null,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.updateCategory(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category Updated Successfully",
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  deleteCategory,
  updateCategory,
};