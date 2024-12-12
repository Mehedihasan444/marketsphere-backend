/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reviews_productId_key" ON "reviews"("productId");
