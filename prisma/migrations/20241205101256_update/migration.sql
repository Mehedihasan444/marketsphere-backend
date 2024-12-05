/*
  Warnings:

  - Made the column `banner` on table `shops` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "shops" ALTER COLUMN "logo" SET DEFAULT 'https://thumbs.dreamstime.com/b/online-shop-vector-logo-business-online-shop-vector-logo-business-illustration-design-139333744.jpg',
ALTER COLUMN "banner" SET NOT NULL,
ALTER COLUMN "banner" SET DEFAULT 'https://t3.ftcdn.net/jpg/03/65/52/86/360_F_365528663_miV08QzGGVLqhRRQVQ4B9C9PtoTRJiSv.jpg';
