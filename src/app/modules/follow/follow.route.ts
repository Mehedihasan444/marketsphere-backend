import express from "express";
import { FollowControllers } from "./follow.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FollowValidationSchema } from "./follow.validation";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();
router.get("/followed-shops",auth(Role.CUSTOMER), FollowControllers.getFollowedShops);

router.post(
  "/:id/follow",
  auth(Role.CUSTOMER),
  validateRequest(FollowValidationSchema.followValidationSchema),
  FollowControllers.followShop
);
router.post(
  "/:id/unfollow",
  auth(Role.CUSTOMER),
  validateRequest(FollowValidationSchema.unfollowValidationSchema),
  FollowControllers.unfollowShop
);

export const FollowRoutes = router;
