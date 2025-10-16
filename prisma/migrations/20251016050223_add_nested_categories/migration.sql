-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "parentId" TEXT;

-- DropEnum
DROP TYPE "warranty";

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
