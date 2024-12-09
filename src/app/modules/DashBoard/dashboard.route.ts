import { Router } from 'express';
import { DashboardControllers } from './dashboard.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.get('/admin',auth(Role.ADMIN,Role.SUPER_ADMIN), DashboardControllers.getAdminDashboardData);
router.get('/vendor',auth(Role.VENDOR), DashboardControllers.getVendorDashboardData);
router.get('/customer',auth(Role.CUSTOMER), DashboardControllers.getCustomerDashboardData);

export const DashboardRoutes=router;