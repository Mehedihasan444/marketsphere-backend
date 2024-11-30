/*
  Warnings:

  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "name" SET NOT NULL;
