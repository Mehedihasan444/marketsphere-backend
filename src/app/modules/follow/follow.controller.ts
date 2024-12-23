import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FollowServices } from "./follow.service";
import httpStatus from "http-status";
const followShop = catchAsync(async (req, res) => {
  const data = req.body;
  const customers = await FollowServices.followShop(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Follow this shop Successfully",
    data: customers,
  });
});
const unfollowShop = catchAsync(async (req, res) => {
  const data = req.body;
  const customers = await FollowServices.unfollowShop(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Unfollow this shop Successfully",
    data: customers,
  });
});
const getFollowedShops = catchAsync(async (req, res) => {

  const customers = await FollowServices.getFollowedShops(req.user.email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Followed shops retrieved  Successfully",
    data: customers,
  });
});

export const FollowControllers = {
  followShop,
  unfollowShop,
  getFollowedShops
};
