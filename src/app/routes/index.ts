import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CustomerRoutes } from "../modules/customer/customer.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { VendorRoutes } from "../modules/vendor/vendor.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { CartRoutes } from "../modules/cart/cart.route";
import { OrderRoutes } from "../modules/order/order.route";
import { ProductRoutes } from "../modules/product/product.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { FollowRoutes } from "../modules/follow/follow.route";
import { FlashSaleRoutes } from "../modules/flashSale/flashSale.route";
import { CouponRoutes } from "../modules/coupon/coupon.route";
import { ShopRoutes } from "../modules/shop/shop.route";
import { BecomeVendorRequestRoutes } from "../modules/becomeVendorRequest/becomeVendorRequest.route";
import { DashboardRoutes } from "../modules/DashBoard/dashboard.route";

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
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/cart",
    route: CartRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/flash-sales",
    route: FlashSaleRoutes,
  },
  {
    path: "/follow-shop",
    route: FollowRoutes,
  },
  {
    path: "/coupons",
    route: CouponRoutes,
  },
  {
    path: "/shops",
    route: ShopRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
  {
    path: "/become-a-vendor",
    route: BecomeVendorRequestRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route as any));

export default router;
