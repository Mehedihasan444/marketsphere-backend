/*
  Warnings:

  - You are about to drop the column `shopId` on the `categories` table. All the data in the column will be lost.
  - Made the column `shopId` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_shopId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "shopId";

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "shopId" SET NOT NULL;

-- CreateTable
CREATE TABLE "customerDashboards" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "totalOrders" INTEGER NOT NULL,
    "totalSpent" DOUBLE PRECISION NOT NULL,
    "totalSaved" DOUBLE PRECISION NOT NULL,
    "totalReviews" INTEGER NOT NULL,
    "totalProducts" INTEGER NOT NULL,
    "totalFollows" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customerDashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendorDashboards" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "totalOrders" INTEGER NOT NULL,
    "totalEarnings" DOUBLE PRECISION NOT NULL,
    "totalProducts" INTEGER NOT NULL,
    "totalCategories" INTEGER NOT NULL,
    "totalReviews" INTEGER NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendorDashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adminDashboards" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "totalUsers" INTEGER NOT NULL,
    "totalVendors" INTEGER NOT NULL,
    "totalCustomers" INTEGER NOT NULL,
    "totalOrders" INTEGER NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL,
    "totalProducts" INTEGER NOT NULL,
    "totalCategories" INTEGER NOT NULL,
    "totalShops" INTEGER NOT NULL,
    "totalReviews" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adminDashboards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "customerDashboards" ADD CONSTRAINT "customerDashboards_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendorDashboards" ADD CONSTRAINT "vendorDashboards_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adminDashboards" ADD CONSTRAINT "adminDashboards_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
