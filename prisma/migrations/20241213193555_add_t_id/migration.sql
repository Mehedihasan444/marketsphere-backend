/*
  Warnings:

  - Added the required column `transactionId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transactionId" TEXT NOT NULL;
