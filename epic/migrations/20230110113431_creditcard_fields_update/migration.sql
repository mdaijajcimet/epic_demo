-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "bonusPointDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "overseasCharges" DECIMAL(4,2);
