-- AlterTable
ALTER TABLE "BalanceTransfer" ADD COLUMN     "btRateStandard" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "quickApproval" BOOLEAN NOT NULL DEFAULT false;
