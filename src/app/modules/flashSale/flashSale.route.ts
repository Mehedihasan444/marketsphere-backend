import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FlashSaleControllers } from "./flashSale.controller";
import { FlashSaleValidationSchema } from "./flashSale.validation";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.VENDOR),
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(FlashSaleValidationSchema.createFlashSaleValidationSchema),
  FlashSaleControllers.createFlashSale
);

router.get("/", FlashSaleControllers.getAllFlashSales);

router.post("/add-product", auth(Role.ADMIN, Role.SUPER_ADMIN, Role.VENDOR), FlashSaleControllers.addProductToFlashSale);
router.get("/vendor/products", auth(Role.VENDOR), FlashSaleControllers.getVendorProductsInFlashSale);
router.get("/products", FlashSaleControllers.getProductsInFlashSale);

router.delete("/delete-product/:id", auth(Role.ADMIN, Role.SUPER_ADMIN, Role.VENDOR), FlashSaleControllers.deleteProductToFlashSale);
router.get("/:id", FlashSaleControllers.getSingleFlashSale);
router.put(
  "/:id",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(FlashSaleValidationSchema.updateFlashSaleValidationSchema),
  FlashSaleControllers.updateFlashSale
);
router.delete(
  "/:id",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  FlashSaleControllers.deleteFlashSale
);

export const FlashSaleRoutes = router;
