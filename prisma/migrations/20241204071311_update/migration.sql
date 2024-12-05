/*
  Warnings:

  - You are about to drop the column `orderId` on the `coupons` table. All the data in the column will be lost.
  - Made the column `shopId` on table `coupons` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_orderId_fkey";

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "orderId",
ALTER COLUMN "shopId" SET NOT NULL;

-- CreateTable
CREATE TABLE "couponItems" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couponItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "couponItems_orderId_key" ON "couponItems"("orderId");

-- AddForeignKey
ALTER TABLE "couponItems" ADD CONSTRAINT "couponItems_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "couponItems" ADD CONSTRAINT "couponItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
