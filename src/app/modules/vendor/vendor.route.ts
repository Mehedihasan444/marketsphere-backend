import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { VendorControllers } from "./vendor.controller";

const router = Router();

// Get all vendors
router.get("/", auth(Role.ADMIN), VendorControllers.getAllVendors);

// Get a vendor by ID
router.get("/:id", auth(Role.ADMIN), VendorControllers.getSingleVendor);

// Update a vendor by ID
router.put("/:id", auth(Role.ADMIN), VendorControllers.updateVendor);

// Delete a vendor by ID
router.delete("/:id", auth(Role.ADMIN), VendorControllers.deleteVendor);

export const VendorRoutes = router;
