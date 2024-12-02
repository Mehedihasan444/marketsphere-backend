import { Router } from "express";
import { CustomerControllers } from "./customer.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

// Get all customers
router.get("/", auth(Role.ADMIN), CustomerControllers.getAllCustomers);

// Get a customer by ID
router.get("/:id", CustomerControllers.getSingleCustomer);

// Update a customer by ID
router.put("/:id", CustomerControllers.updateCustomer);

// Delete a customer by ID
router.delete("/:id", auth(Role.ADMIN), CustomerControllers.deleteCustomer);

export const CustomerRoutes = router;
