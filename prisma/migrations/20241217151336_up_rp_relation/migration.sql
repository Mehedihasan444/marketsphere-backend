-- AddForeignKey
ALTER TABLE "recentProducts" ADD CONSTRAINT "recentProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
