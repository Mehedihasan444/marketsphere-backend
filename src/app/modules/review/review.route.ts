import express from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewControllers } from "./review.controller";
import { reviewValidationSchema } from "./review.validation";

const router = express.Router();

export const ReviewRoutes = router;

// Route to create a new Review (only accessible by Admins)
router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(reviewValidationSchema.createReviewValidationSchema),
  ReviewControllers.createReview
);

// Route to get all reviews (publicly accessible)
router.get(
  "/",
  auth(Role.ADMIN, Role.CUSTOMER, Role.VENDOR),
  ReviewControllers.getAllReviews
);
// Route to get all reviews (publicly accessible)
router.get(
  "/product/:id",
  auth(Role.ADMIN, Role.CUSTOMER, Role.VENDOR),
  ReviewControllers.getProductReviews
);

// Route to update a Review (only accessible by Admins)
router.put(
  "/:id",
  auth(Role.CUSTOMER),
  validateRequest(reviewValidationSchema.updateReviewValidationSchema),
  ReviewControllers.updateReview
);

// Route to get a single Review (publicly accessible)
router.get("/:id", auth(Role.CUSTOMER), ReviewControllers.getSingleReview);

// Route to delete a Review (only accessible by Admins)
router.delete(
  "/:id",
  auth(Role.ADMIN, Role.SUPER_ADMIN,Role.VENDOR),
  ReviewControllers.deleteReview
);
