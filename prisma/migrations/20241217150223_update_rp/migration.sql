/*
  Warnings:

  - The primary key for the `recentProducts` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "recentProducts" DROP CONSTRAINT "recentProducts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "customerId" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "recentProducts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "recentProducts_id_seq";
