-- CreateEnum
CREATE TYPE "warranty" AS ENUM ('NO', 'YES');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "warrantyDuration" INTEGER,
ADD COLUMN     "warrantyEndDate" TIMESTAMP(3),
ADD COLUMN     "warrantyNumber" TEXT,
ADD COLUMN     "warrantyStartDate" TIMESTAMP(3),
ADD COLUMN     "warrantyStatus" TEXT,
ADD COLUMN     "warrantyTerms" TEXT;
