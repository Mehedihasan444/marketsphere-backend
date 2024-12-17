-- CreateTable
CREATE TABLE "recentProducts" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recentProducts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recentProducts_customerId_idx" ON "recentProducts"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "recentProducts_customerId_productId_key" ON "recentProducts"("customerId", "productId");
