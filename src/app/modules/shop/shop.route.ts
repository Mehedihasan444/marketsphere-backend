import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { ShopControllers } from "./shop.controller";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

export const ShopRoutes = router;

// Route to create a new Shop (only accessible by Vendors)
router.post(
  "/",
  auth(Role.VENDOR),
  upload.fields([
    { name: "logo", maxCount: 1 }, // Handle `logo` file upload
    { name: "banner", maxCount: 1 }, // Handle `banner` file upload
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);

    next();
  },
  //   validateRequest(shopValidationSchema.createShopValidationSchema),
  ShopControllers.createShop
);

// Route to get all Shops (accessible by Admins and Customers)
router.get(
  "/",
  auth(Role.ADMIN,Role.SUPER_ADMIN, Role.CUSTOMER, Role.VENDOR),
  ShopControllers.getAllShops
);

// Route to update a Shop (only accessible by Vendors)
router.patch(
  "/:id",
  auth(Role.VENDOR),
  upload.fields([
    { name: "logo", maxCount: 1 }, // Handle `logo` file upload
    { name: "banner", maxCount: 1 }, // Handle `banner` file upload
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);

    next();
  },
  //   validateRequest(shopValidationSchema.updateShopValidationSchema),
  ShopControllers.updateShop
);

router.patch("/:id/status",auth(Role.SUPER_ADMIN,Role.ADMIN), ShopControllers.updateShopStatus);
// Route to get a single Shop (publicly accessible)
router.get("/:id", ShopControllers.getSingleShop);

// Route to delete a Shop (only accessible by Admins)
router.delete("/:id", auth(Role.VENDOR,Role.ADMIN,Role.SUPER_ADMIN), ShopControllers.deleteShop);
