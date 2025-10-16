import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { CategoryControllers } from "./category.controller"; // Adjust the import path
import validateRequest from "../../middlewares/validateRequest";
import { categoryValidationSchema } from "./category.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

export const CategoryRoutes = router;

// Route to create a new category (only accessible by Admins)
router.post(
  "/",
  auth(Role.ADMIN),
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  // validateRequest(categoryValidationSchema.createCategoryValidationSchema),
  CategoryControllers.createCategory
);

// Route to get all categories (publicly accessible)
router.get("/", CategoryControllers.getAllCategories);

// Route to get category statistics (publicly accessible)
router.get("/stats/overview", CategoryControllers.getCategoryStats);

// Route to get products by category slug (publicly accessible)
router.get("/slug/:slug/products", CategoryControllers.getProductsByCategorySlug);

// Route to get a single category by slug (publicly accessible)
router.get("/slug/:slug", CategoryControllers.getCategoryBySlug);

// Route to get a single category by ID (publicly accessible)
router.get("/:id", CategoryControllers.getSingleCategory);

// Route to update a category (only accessible by Admins)
router.patch(
  "/:id",
  auth(Role.ADMIN),
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  // validateRequest(categoryValidationSchema.updateCategoryValidationSchema),
  CategoryControllers.updateCategory
);

// Route to delete a category (only accessible by Admins)
router.delete("/:id", auth(Role.ADMIN), CategoryControllers.deleteCategory);
