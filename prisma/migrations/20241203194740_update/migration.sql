/*
  Warnings:

  - You are about to drop the column `productId` on the `flashSales` table. All the data in the column will be lost.
  - Added the required column `flashSaleId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "flashSales" DROP CONSTRAINT "flashSales_productId_fkey";

-- AlterTable
ALTER TABLE "flashSales" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "flashSaleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_flashSaleId_fkey" FOREIGN KEY ("flashSaleId") REFERENCES "flashSales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
