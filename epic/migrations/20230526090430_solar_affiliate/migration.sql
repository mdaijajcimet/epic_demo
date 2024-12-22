-- CreateTable
CREATE TABLE "SolarAffiliate" (
    "id" TEXT NOT NULL,
    "range" DECIMAL(18,4) NOT NULL,
    "affiliate" TEXT,

    CONSTRAINT "SolarAffiliate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SolarAffiliate_affiliate_idx" ON "SolarAffiliate"("affiliate");

-- AddForeignKey
ALTER TABLE "SolarAffiliate" ADD CONSTRAINT "SolarAffiliate_affiliate_fkey" FOREIGN KEY ("affiliate") REFERENCES "Affiliate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
