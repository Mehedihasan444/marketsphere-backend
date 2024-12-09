import express from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { BecomeVendorRequestControllers } from "./becomeVendorRequest.controller";
const router = express.Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  BecomeVendorRequestControllers.InsertBecomeVendorRequest
);
router.get(
  "/",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  BecomeVendorRequestControllers.getAllBecomeVendorRequests
);
router.patch(
  "/:id/status",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  BecomeVendorRequestControllers.updateBecomeVendorRequest
);
router.get(
  "/:id",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  BecomeVendorRequestControllers.getSingleBecomeVendorRequest
);
router.delete(
  "/:id",
  auth(Role.CUSTOMER),
  BecomeVendorRequestControllers.deleteBecomeVendorRequest
);

export const BecomeVendorRequestRoutes = router;
