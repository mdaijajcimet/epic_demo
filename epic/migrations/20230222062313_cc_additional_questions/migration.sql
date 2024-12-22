/*
  Warnings:

  - You are about to drop the column `foreignExchangeFeeStandard` on the `CreditCard` table. All the data in the column will be lost.
  - The `ewalletPaymentOptions` column on the `CreditCard` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "foreignExchangeFeeStandard",
DROP COLUMN "ewalletPaymentOptions",
ADD COLUMN     "ewalletPaymentOptions" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "CreditCardFee" ADD COLUMN     "foreignExchangeFeeStandard" DECIMAL(4,2);

-- CreateTable
CREATE TABLE "AdditionalQuestion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "provider" TEXT,
    "creditCard" TEXT,

    CONSTRAINT "AdditionalQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdditionalQuestion_provider_idx" ON "AdditionalQuestion"("provider");

-- CreateIndex
CREATE INDEX "AdditionalQuestion_creditCard_idx" ON "AdditionalQuestion"("creditCard");

-- AddForeignKey
ALTER TABLE "AdditionalQuestion" ADD CONSTRAINT "AdditionalQuestion_provider_fkey" FOREIGN KEY ("provider") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalQuestion" ADD CONSTRAINT "AdditionalQuestion_creditCard_fkey" FOREIGN KEY ("creditCard") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
