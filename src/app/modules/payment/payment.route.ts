import express from 'express';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';
import { paymentControllers } from './payment.controller';
const router = express.Router();

router.post('/',auth(Role.CUSTOMER), paymentControllers.makePayment);
router.post("/confirmation", paymentControllers.paymentConfirmation);
router.post("/failed", paymentControllers.paymentFailed);

export const PaymentRoutes = router;