/*
  Warnings:

  - A unique constraint covering the columns `[customerId,shopId]` on the table `follows` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "follows_customerId_shopId_key" ON "follows"("customerId", "shopId");
