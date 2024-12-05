/*
  Warnings:

  - You are about to drop the column `code` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `coupons` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `couponItems` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `couponItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `couponItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiryDate` to the `couponItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "coupons_code_key";

-- AlterTable
ALTER TABLE "couponItems" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "code",
DROP COLUMN "discount",
DROP COLUMN "expiryDate";

-- CreateIndex
CREATE UNIQUE INDEX "couponItems_code_key" ON "couponItems"("code");
