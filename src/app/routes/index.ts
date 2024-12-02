import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CustomerRoutes } from "../modules/customer/customer.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { VendorRoutes } from "../modules/vendor/vendor.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/customers",
    route: CustomerRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/vendors",
    route: VendorRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route as any));

export default router;
