-- AlterTable
ALTER TABLE "CsSite" ADD COLUMN     "affiliate" TEXT;

-- CreateIndex
CREATE INDEX "CsSite_affiliate_idx" ON "CsSite"("affiliate");

-- AddForeignKey
ALTER TABLE "CsSite" ADD CONSTRAINT "CsSite_affiliate_fkey" FOREIGN KEY ("affiliate") REFERENCES "Affiliate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
