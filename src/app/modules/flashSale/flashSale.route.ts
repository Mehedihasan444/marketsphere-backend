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
  (req:Request, res:Response, next:NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(FlashSaleValidationSchema.createFlashSaleValidationSchema),
  FlashSaleControllers.createFlashSale
);
router.get("/", FlashSaleControllers.getAllFlashSales);
router.put(
  "/:id",
  auth(Role.ADMIN, Role.VENDOR),
  validateRequest(FlashSaleValidationSchema.updateFlashSaleValidationSchema),
  FlashSaleControllers.getSingleFlashSale
);
router.delete(
  "/:id",
  auth(Role.ADMIN, Role.VENDOR),
  FlashSaleControllers.deleteFlashSale
);

export const FlashSaleRoutes = router;
