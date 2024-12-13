/*
  Warnings:

  - The `status` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `method` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TransactionMethod" AS ENUM ('CASH_ON_DELIVERY', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'UPI');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "method",
ADD COLUMN     "method" "TransactionMethod" NOT NULL DEFAULT 'NET_BANKING';
