/*
  Warnings:

  - You are about to alter the column `capacityRangeDiff` on the `SolarAffiliate` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,4)` to `Decimal(4,2)`.

*/
-- AlterTable
ALTER TABLE "SolarAffiliate" ALTER COLUMN "capacityRangeDiff" SET DEFAULT 0,
ALTER COLUMN "capacityRangeDiff" SET DATA TYPE DECIMAL(4,2);
