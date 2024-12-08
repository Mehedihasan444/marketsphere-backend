/*
  Warnings:

  - You are about to drop the column `description` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `shopLogo` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `shopName` on the `vendors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vendors" DROP COLUMN "description",
DROP COLUMN "shopLogo",
DROP COLUMN "shopName";
