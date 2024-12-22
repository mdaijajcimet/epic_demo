-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "targetMarketDetermination" TEXT;

-- CreateTable
CREATE TABLE "CardFeature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "creditCard" TEXT,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CardFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CardFeature_creditCard_idx" ON "CardFeature"("creditCard");

-- CreateIndex
CREATE INDEX "CreditCard_targetMarketDetermination_idx" ON "CreditCard"("targetMarketDetermination");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_targetMarketDetermination_fkey" FOREIGN KEY ("targetMarketDetermination") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardFeature" ADD CONSTRAINT "CardFeature_creditCard_fkey" FOREIGN KEY ("creditCard") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
