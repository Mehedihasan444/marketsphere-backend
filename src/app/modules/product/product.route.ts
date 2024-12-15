import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { Role } from "@prisma/client";
import { ProductControllers } from "./product.controller";
import { productValidationSchema } from "./product.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

export const ProductRoutes = router;

// Route to create a new product (only accessible by Vendors or Admins)
router.post(
  "/",
  auth(Role.VENDOR, Role.ADMIN),
  upload.array("images", 5),
  (req:Request, res:Response, next:NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(productValidationSchema.createProductValidationSchema),
  ProductControllers.createProduct
);

// Route to get all products (publicly accessible)
router.get("/", ProductControllers.getAllProducts);

// Route to get all vendor products (publicly accessible)
router.get("/vendor",auth(Role.VENDOR), ProductControllers.getAllVendorProducts);

// get priority based products
router.get("/priority", auth(Role.CUSTOMER,Role.ADMIN,Role.SUPER_ADMIN,Role.VENDOR),ProductControllers.getPriorityProducts);
// Route to update a product (only accessible by the Vendor who created it or Admin)
router.put(
  "/:id",
  auth(Role.VENDOR, Role.ADMIN),
  validateRequest(productValidationSchema.updateProductValidationSchema),
  ProductControllers.updateProduct
);

// Route to get a single product (publicly accessible)
router.get("/:id", ProductControllers.getSingleProduct);

// Route to delete a product (only accessible by the Vendor who created it or Admin)
router.delete(
  "/:id",
  auth(Role.VENDOR, Role.ADMIN),
  ProductControllers.deleteProduct
);
