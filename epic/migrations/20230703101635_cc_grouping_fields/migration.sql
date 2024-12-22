/*
  Warnings:

  - You are about to drop the column `additionalCardHolders` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `additionalCardHoldersFee` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `atmFeeStandard` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `cashAdvRateIntro` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `cashAdvRateIntroTerm` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `cashAdvRateStandard` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `interestFreeDays` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `interestFreeDaysDescription` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `maxCreditLimit` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `minCreditLimit` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `minRepaymentDollars` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `minRepaymentPercent` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `overseasCharges` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseRateIntro` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseRateIntroTerm` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseRateStandard` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `amexOverseasReplaceCardFee` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `foreignExchangeFeeStandard` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeAmexATM` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeAmexAUDatInternational` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeAmexDollar` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeAmexPercent` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeMCATM` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeMCDollar` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeMCPercent` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeVisaATM` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeVisaDollar` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeVisaPercent` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `mcOverseasReplaceCardFee` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `overseascashAdvancerate` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `visaOverseasReplaceCardFee` on the `CreditCardFee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rates]` on the table `CreditCard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[overseasSpends]` on the table `CreditCard` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "additionalCardHolders",
DROP COLUMN "additionalCardHoldersFee",
DROP COLUMN "atmFeeStandard",
DROP COLUMN "cashAdvRateIntro",
DROP COLUMN "cashAdvRateIntroTerm",
DROP COLUMN "cashAdvRateStandard",
DROP COLUMN "interestFreeDays",
DROP COLUMN "interestFreeDaysDescription",
DROP COLUMN "maxCreditLimit",
DROP COLUMN "minCreditLimit",
DROP COLUMN "minRepaymentDollars",
DROP COLUMN "minRepaymentPercent",
DROP COLUMN "overseasCharges",
DROP COLUMN "purchaseRateIntro",
DROP COLUMN "purchaseRateIntroTerm",
DROP COLUMN "purchaseRateStandard",
ADD COLUMN     "keyFactSheet" TEXT,
ADD COLUMN     "overseasSpends" TEXT,
ADD COLUMN     "rates" TEXT;

-- AlterTable
ALTER TABLE "CreditCardFee" DROP COLUMN "amexOverseasReplaceCardFee",
DROP COLUMN "foreignExchangeFeeStandard",
DROP COLUMN "fxFeeAmexATM",
DROP COLUMN "fxFeeAmexAUDatInternational",
DROP COLUMN "fxFeeAmexDollar",
DROP COLUMN "fxFeeAmexPercent",
DROP COLUMN "fxFeeMCATM",
DROP COLUMN "fxFeeMCDollar",
DROP COLUMN "fxFeeMCPercent",
DROP COLUMN "fxFeeVisaATM",
DROP COLUMN "fxFeeVisaDollar",
DROP COLUMN "fxFeeVisaPercent",
DROP COLUMN "mcOverseasReplaceCardFee",
DROP COLUMN "overseascashAdvancerate",
DROP COLUMN "visaOverseasReplaceCardFee",
ADD COLUMN     "additionalCardHolders" INTEGER,
ADD COLUMN     "additionalCardHoldersFee" DECIMAL(4,2),
ADD COLUMN     "atmFeeStandard" DECIMAL(4,2);

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "linkUrl" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "CardDetail" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "creditCard" TEXT,
    "interestFreeDays" INTEGER,
    "interestFreeDaysDescription" TEXT NOT NULL DEFAULT '',
    "minRepaymentDollars" INTEGER,
    "minRepaymentPercent" DECIMAL(4,2),
    "minCreditLimit" INTEGER,
    "maxCreditLimit" INTEGER,

    CONSTRAINT "CardDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "cashAdvRateIntro" DECIMAL(4,2),
    "cashAdvRateIntroTerm" INTEGER,
    "cashAdvRateStandard" DECIMAL(4,2),
    "purchaseRateIntro" DECIMAL(4,2),
    "purchaseRateIntroTerm" INTEGER,
    "purchaseRateStandard" DECIMAL(4,2),

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OverseasSpend" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "overseasCharges" DECIMAL(4,2),
    "overseascashAdvancerate" INTEGER,
    "foreignExchangeFeeStandard" DECIMAL(4,2),
    "fxFeeVisaDollar" INTEGER,
    "fxFeeVisaPercent" DECIMAL(4,2),
    "fxFeeVisaATM" INTEGER,
    "visaOverseasReplaceCardFee" INTEGER,
    "fxFeeMCDollar" INTEGER,
    "fxFeeMCPercent" DECIMAL(4,2),
    "fxFeeMCATM" INTEGER,
    "mcOverseasReplaceCardFee" INTEGER,
    "fxFeeAmexDollar" INTEGER,
    "fxFeeAmexPercent" DECIMAL(4,2),
    "fxFeeAmexATM" INTEGER,
    "amexOverseasReplaceCardFee" INTEGER,
    "fxFeeAmexAUDatInternational" INTEGER,

    CONSTRAINT "OverseasSpend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardDetail_creditCard_key" ON "CardDetail"("creditCard");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_rates_key" ON "CreditCard"("rates");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_overseasSpends_key" ON "CreditCard"("overseasSpends");

-- CreateIndex
CREATE INDEX "CreditCard_keyFactSheet_idx" ON "CreditCard"("keyFactSheet");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_rates_fkey" FOREIGN KEY ("rates") REFERENCES "Rate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_overseasSpends_fkey" FOREIGN KEY ("overseasSpends") REFERENCES "OverseasSpend"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_keyFactSheet_fkey" FOREIGN KEY ("keyFactSheet") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardDetail" ADD CONSTRAINT "CardDetail_creditCard_fkey" FOREIGN KEY ("creditCard") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
