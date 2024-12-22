/*
  Warnings:

  - You are about to drop the column `dishonourFee` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `eligibilityCondition` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `informationRequestFee` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `minAge` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `minIncome` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `overTheCounterTransactionFee` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `overlimitFee` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `paperStatementFee` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `residency` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `voucherRequestFee` on the `CreditCard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eligibility]` on the table `CreditCard` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "dishonourFee",
DROP COLUMN "eligibilityCondition",
DROP COLUMN "informationRequestFee",
DROP COLUMN "minAge",
DROP COLUMN "minIncome",
DROP COLUMN "overTheCounterTransactionFee",
DROP COLUMN "overlimitFee",
DROP COLUMN "paperStatementFee",
DROP COLUMN "residency",
DROP COLUMN "voucherRequestFee",
ADD COLUMN     "cashbackDiscounts" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "eligibility" TEXT;

-- AlterTable
ALTER TABLE "CreditCardFee" ADD COLUMN     "cashAdvanceFeeInternational" INTEGER,
ADD COLUMN     "crossBorderFee" DECIMAL(4,2),
ADD COLUMN     "dishonourFee" DECIMAL(4,2),
ADD COLUMN     "informationRequestFee" DECIMAL(4,2),
ADD COLUMN     "overTheCounterTransactionFee" DECIMAL(4,2),
ADD COLUMN     "overseascashAdvancerate" INTEGER,
ADD COLUMN     "paperStatementFee" DECIMAL(4,2),
ADD COLUMN     "voucherRequestFee" DECIMAL(4,2);

-- AlterTable
ALTER TABLE "RewardProgram" ADD COLUMN     "rewardProgramFee" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Eligibility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "minAge" INTEGER,
    "minIncome" INTEGER,
    "eligibilityCondition" TEXT NOT NULL DEFAULT '',
    "residency" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Eligibility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_eligibility_key" ON "CreditCard"("eligibility");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_eligibility_fkey" FOREIGN KEY ("eligibility") REFERENCES "Eligibility"("id") ON DELETE SET NULL ON UPDATE CASCADE;
