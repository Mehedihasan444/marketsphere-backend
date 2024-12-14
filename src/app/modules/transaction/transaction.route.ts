import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { transactionController } from "./transaction.controller";
import express from 'express';

const router = express.Router();

router.get('/',auth(Role.ADMIN,Role.SUPER_ADMIN),transactionController.getAllTransactions)

export const TransactionRoutes = router;