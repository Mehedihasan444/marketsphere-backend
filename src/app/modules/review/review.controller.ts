import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import { ReviewFilterableFields } from "./review.constant";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(async (req, res) => {
    const Review = await ReviewServices.createReview(req.body);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review Created Successfully",
      data: Review,
    });
  });
  
  const getAllReviews = catchAsync(async (req, res) => {
    const filters = pick(req.query, ReviewFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const   userEmail= req.user.email;
    const Reviews = await ReviewServices.getAllReviewsFromDB(filters, options,userEmail);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews Retrieved Successfully",
      data: Reviews,
    });
  });
  
  const getSingleReview = catchAsync(async (req, res) => {
    const Review = await ReviewServices.getSingleReviewFromDB(req.params.id);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review Retrieved Successfully",
      data: Review,
    });
  });
  
  const deleteReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    await ReviewServices.deleteReviewFromDB(id);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review Deleted Successfully",
      data: null,
    });
  });
  
  const updateReview = catchAsync(async (req, res) => {
    const result = await ReviewServices.updateReview(req.params.id, req.body);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review Updated Successfully",
      data: result,
    });
  });
  
  export const ReviewControllers = {
    createReview,
    getAllReviews,
    getSingleReview,
    deleteReview,
    updateReview,
  };