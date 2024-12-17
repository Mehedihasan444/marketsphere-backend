import express from 'express';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';
import { RecentViewProductsControllers } from './recentViewProducts.controller';

const router = express.Router();

router.post('/', auth(Role.CUSTOMER), RecentViewProductsControllers.createRecentViewProduct);
router.get('/', auth(Role.CUSTOMER), RecentViewProductsControllers.getRecentViewProducts)

export const RecentViewProductsRoutes = router;