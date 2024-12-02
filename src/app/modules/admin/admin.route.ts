import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { AdminControllers } from "./admin.controller";

const router = Router();

// Get all customers
router.get("/", auth(Role.ADMIN), AdminControllers.getAllAdmins);

// Get a Admin by ID
router.get("/:id", AdminControllers.getSingleAdmin);

// Update a Admin by ID
router.put("/:id", AdminControllers.updateAdmin);

// Delete a Admin by ID
router.delete("/:id", auth(Role.ADMIN), AdminControllers.deleteAdmin);

export const AdminRoutes = router;
