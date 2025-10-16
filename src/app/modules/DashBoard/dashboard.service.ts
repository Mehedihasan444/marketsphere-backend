import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";

const getAdminDashboardData = async (adminId: string) => {
  // Verify admin exists
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!admin) {
    throw new AppError(404, "Admin not found");
  }

  // Calculate real-time statistics
  const [
    totalUsers,
    totalVendors,
    totalCustomers,
    totalOrders,
    totalProducts,
    totalCategories,
    totalShops,
    totalReviews,
    revenueData,
  ] = await Promise.all([
    prisma.user.count({
      where: { isDeleted: false },
    }),
    prisma.vendor.count({
      where: { isDeleted: false },
    }),
    prisma.customer.count({
      where: { isDeleted: false },
    }),
    prisma.order.count(),
    prisma.product.count({
      where: { isDeleted: false },
    }),
    prisma.category.count({
      where: { isDeleted: false },
    }),
    prisma.shop.count({
      where: { isDeleted: false },
    }),
    prisma.review.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  const totalRevenue = revenueData._sum?.totalAmount || 0;

  const dashboardData = {
    totalUsers,
    totalVendors,
    totalCustomers,
    totalOrders,
    totalRevenue,
    totalProducts,
    totalCategories,
    totalShops,
    totalReviews,
  };

  // Find existing dashboard or create new
  const existingDashboard = await prisma.adminDashboard.findFirst({
    where: { adminId },
  });

  if (existingDashboard) {
    await prisma.adminDashboard.update({
      where: { id: existingDashboard.id },
      data: {
        ...dashboardData,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.adminDashboard.create({
      data: {
        adminId,
        ...dashboardData,
      },
    });
  }

  return dashboardData;
};

const getVendorDashboardData = async (vendorId: string) => {
  // Verify vendor exists
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: { shop: true },
  });

  if (!vendor) {
    throw new AppError(404, "Vendor not found");
  }

  // If vendor hasn't created a shop yet, return zero statistics
  if (!vendor.shop || vendor.shop.length === 0) {
    const emptyDashboardData = {
      totalOrders: 0,
      totalEarnings: 0,
      totalProducts: 0,
      totalReviews: 0,
      averageRating: 0,
    };

    // Find existing dashboard or create new
    const existingDashboard = await prisma.vendorDashboard.findFirst({
      where: { vendorId },
    });

    if (existingDashboard) {
      await prisma.vendorDashboard.update({
        where: { id: existingDashboard.id },
        data: {
          ...emptyDashboardData,
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.vendorDashboard.create({
        data: {
          vendorId,
          ...emptyDashboardData,
        },
      });
    }

    return emptyDashboardData;
  }

  const shopId = vendor.shop[0].id;

  // Calculate real-time statistics
  const [totalOrders, totalProducts, totalReviews, earningsData, productRatings, recentOrders] =
    await Promise.all([
      prisma.order.count({
        where: { shopId },
      }),
      prisma.product.count({
        where: {
          shopId,
          isDeleted: false,
        },
      }),
      prisma.review.count({
        where: { shopId },
      }),
      prisma.order.aggregate({
        where: { shopId },
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.product.findMany({
        where: { shopId, isDeleted: false },
        select: { rating: true },
      }),
      prisma.order.findMany({
        where: { shopId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            include: {
              user: {
                select: {
                  name: true,
                }
              }
            }
          }
        },
      }),
    ]);

  const totalEarnings = earningsData._sum?.totalAmount || 0;
  
  // Calculate average rating from products
  const averageRating = productRatings.length > 0
    ? productRatings.reduce((sum, p) => sum + p.rating, 0) / productRatings.length
    : 0;

  // Format recent orders for response
  const formattedRecentOrders = recentOrders.map(order => ({
    orderId: order.orderNumber,
    customerName: order.customer?.user?.name || 'Unknown Customer',
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
  }));

  // Data to store in database (without recentOrders)
  const dbData = {
    totalOrders,
    totalEarnings,
    totalProducts,
    totalReviews,
    averageRating: parseFloat(averageRating.toFixed(2)),
  };

  // Data to return to API (with recentOrders)
  const responseData = {
    ...dbData,
    recentOrders: formattedRecentOrders,
  };

  // Find existing dashboard or create new
  const existingDashboard = await prisma.vendorDashboard.findFirst({
    where: { vendorId },
  });

  if (existingDashboard) {
    await prisma.vendorDashboard.update({
      where: { id: existingDashboard.id },
      data: {
        ...dbData,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.vendorDashboard.create({
      data: {
        vendorId,
        ...dbData,
      },
    });
  }

  return responseData;
};

const getCustomerDashboardData = async (customerId: string) => {
  // Verify customer exists
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new AppError(404, "Customer not found");
  }

  // Calculate real-time statistics
  const [totalOrders, totalReviews, totalFollows, spentData, savedData] =
    await Promise.all([
      prisma.order.count({
        where: { customerId },
      }),
      prisma.reviewItem.count({
        where: { customerId },
      }),
      prisma.follow.count({
        where: { customerId },
      }),
      prisma.order.aggregate({
        where: { customerId },
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.order.aggregate({
        where: { customerId },
        _sum: {
          discount: true,
        },
      }),
    ]);

  const totalSpent = spentData._sum?.totalAmount || 0;
  const totalSaved = savedData._sum?.discount || 0;

  const dashboardData = {
    totalOrders,
    totalSpent,
    totalSaved,
    totalReviews,
    totalFollows,
  };

  // Find existing dashboard or create new
  const existingDashboard = await prisma.customerDashboard.findFirst({
    where: { customerId },
  });

  if (existingDashboard) {
    await prisma.customerDashboard.update({
      where: { id: existingDashboard.id },
      data: {
        ...dashboardData,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.customerDashboard.create({
      data: {
        customerId,
        ...dashboardData,
      },
    });
  }

  return dashboardData;
};

export const DashboardServices = {
  getAdminDashboardData,
  getVendorDashboardData,
  getCustomerDashboardData,
};