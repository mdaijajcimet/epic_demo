-- CreateTable
CREATE TABLE "RetailerMatrix" (
    "id" TEXT NOT NULL,
    "retailer" TEXT,
    "vertical" TEXT,
    "propertyType" TEXT,
    "saleType" TEXT,
    "energyType" TEXT,
    "state" TEXT,
    "range" TEXT NOT NULL DEFAULT '',
    "moveIn" TEXT,
    "plan" TEXT,
    "cost" DECIMAL(18,2) NOT NULL,
    "image" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "lastModified" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RetailerMatrix_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RetailerMatrix_retailer_idx" ON "RetailerMatrix"("retailer");

-- CreateIndex
CREATE INDEX "RetailerMatrix_vertical_idx" ON "RetailerMatrix"("vertical");

-- CreateIndex
CREATE INDEX "RetailerMatrix_plan_idx" ON "RetailerMatrix"("plan");

-- CreateIndex
CREATE INDEX "RetailerMatrix_image_idx" ON "RetailerMatrix"("image");

-- AddForeignKey
ALTER TABLE "RetailerMatrix" ADD CONSTRAINT "RetailerMatrix_retailer_fkey" FOREIGN KEY ("retailer") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailerMatrix" ADD CONSTRAINT "RetailerMatrix_vertical_fkey" FOREIGN KEY ("vertical") REFERENCES "Vertical"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailerMatrix" ADD CONSTRAINT "RetailerMatrix_plan_fkey" FOREIGN KEY ("plan") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailerMatrix" ADD CONSTRAINT "RetailerMatrix_image_fkey" FOREIGN KEY ("image") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
