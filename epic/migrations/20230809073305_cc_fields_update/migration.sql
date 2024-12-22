/*
  Warnings:

  - The values [diners_club,visa_amex,mastercard_amex] on the enum `CreditCardCardNetworkType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `description` on the `BalanceTransfer` table. All the data in the column will be lost.
  - You are about to drop the column `maxBTPercent` on the `BalanceTransfer` table. All the data in the column will be lost.
  - You are about to alter the column `btFeeDollars` on the `BalanceTransfer` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - You are about to alter the column `btIntro` on the `BalanceTransfer` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - You are about to alter the column `btRateStandard` on the `BalanceTransfer` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - You are about to alter the column `btRevertRate` on the `BalanceTransfer` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - You are about to drop the column `cashAdvanceFeeInternational` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `amexOverseasReplaceCardFee` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeAmexATM` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeAmexAUDatInternational` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeAmexDollar` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeAmexPercent` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeMCATM` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeMCDollar` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeMCPercent` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeVisaATM` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeVisaDollar` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeVisaPercent` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `mcOverseasReplaceCardFee` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `overseasCharges` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to drop the column `visaOverseasReplaceCardFee` on the `OverseasSpend` table. All the data in the column will be lost.
  - You are about to alter the column `rewardProgramFee` on the `RewardProgram` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - Made the column `pointsEarned` on table `EarnRate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rangeMinimum` on table `EarnRate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rangeMax` on table `EarnRate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rangeUnit` on table `EarnRate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rangePeriod` on table `EarnRate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CreditCardCardNetworkType_new" AS ENUM ('visa', 'mastercard', 'amex', 'dinersClub');
ALTER TABLE "CreditCard" ALTER COLUMN "cardNetwork" TYPE "CreditCardCardNetworkType_new" USING ("cardNetwork"::text::"CreditCardCardNetworkType_new");
ALTER TYPE "CreditCardCardNetworkType" RENAME TO "CreditCardCardNetworkType_old";
ALTER TYPE "CreditCardCardNetworkType_new" RENAME TO "CreditCardCardNetworkType";
DROP TYPE "CreditCardCardNetworkType_old";
COMMIT;

-- AlterTable
ALTER TABLE "BalanceTransfer" DROP COLUMN "description",
DROP COLUMN "maxBTPercent",
ALTER COLUMN "minBTAmount" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "maxBTAmount" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "btFeeDollars" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "btFeePercent" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "btIntro" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "btRateStandard" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "btRevertRate" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "CardDetail" ALTER COLUMN "minRepaymentDollars" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "minRepaymentPercent" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "CreditCardFee" DROP COLUMN "cashAdvanceFeeInternational",
ADD COLUMN     "crossBorderFeePercent" DECIMAL(18,2),
ALTER COLUMN "annualFeeIntro" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "annualFeeStandard" SET DEFAULT 0,
ALTER COLUMN "annualFeeStandard" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "annualFeeSpendWaiver" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "cashAdvanceMinFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "cashAdvanceMaxFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "cashAdvancePercent" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "latePaymentFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "overLimitFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "duplicateStatementFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "crossBorderFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "dishonourFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "informationRequestFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "overTheCounterTransactionFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "paperStatementFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "voucherRequestFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "additionalCardHoldersFee" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "atmFeeStandard" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "EarnRate" ALTER COLUMN "pointsEarned" SET NOT NULL,
ALTER COLUMN "pointsEarned" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "rangeMinimum" SET NOT NULL,
ALTER COLUMN "rangeMax" SET NOT NULL,
ALTER COLUMN "rangeUnit" SET NOT NULL,
ALTER COLUMN "rangePeriod" SET NOT NULL;

-- AlterTable
ALTER TABLE "OverseasSpend" DROP COLUMN "amexOverseasReplaceCardFee",
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
DROP COLUMN "overseasCharges",
DROP COLUMN "visaOverseasReplaceCardFee",
ADD COLUMN     "cashAdvanceFeeInternational" DECIMAL(18,2),
ADD COLUMN     "cashAdvanceFeeInternationalPercent" DECIMAL(18,2),
ADD COLUMN     "fxATMFeeDollar" DECIMAL(18,2),
ADD COLUMN     "fxATMFeePercent" DECIMAL(18,2),
ADD COLUMN     "overseasReplaceCardFee" DECIMAL(18,2),
ALTER COLUMN "overseascashAdvancerate" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "foreignExchangeFeeStandard" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "Rate" ALTER COLUMN "cashAdvRateIntro" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "cashAdvRateStandard" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "purchaseRateIntro" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "purchaseRateStandard" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "RewardProgram" ALTER COLUMN "rewardProgramFee" SET DATA TYPE DECIMAL(18,2);
