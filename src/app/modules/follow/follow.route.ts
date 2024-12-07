import express from "express";
import { FollowControllers } from "./follow.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FollowValidationSchema } from "./follow.validation";

const router = express.Router();

router.post(
  "/follow",
  validateRequest(FollowValidationSchema.followValidationSchema),
  FollowControllers.followShop
);
router.post(
  "/unfollow",
  validateRequest(FollowValidationSchema.unfollowValidationSchema),
  FollowControllers.unfollowShop
);

export const FollowRoutes = router;
