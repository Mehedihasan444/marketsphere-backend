import express from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { CategoryControllers } from "./category.controller"; // Adjust the import path
import validateRequest from "../../middlewares/validateRequest ";
import { categoryValidationSchema } from "./category.validation";

const router = express.Router();

export const CategoryRoutes = router;

// Route to create a new category (only accessible by Admins)
router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(categoryValidationSchema.createCategoryValidationSchema),
  CategoryControllers.createCategory
);

// Route to get all categories (publicly accessible)
router.get("/", CategoryControllers.getAllCategories);

// Route to update a category (only accessible by Admins)
router.put(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(categoryValidationSchema.updateCategoryValidationSchema),
  CategoryControllers.updateCategory
);

// Route to get a single category (publicly accessible)
router.get("/:id", CategoryControllers.getSingleCategory);

// Route to delete a category (only accessible by Admins)
router.delete("/:id", auth(Role.ADMIN), CategoryControllers.deleteCategory);
