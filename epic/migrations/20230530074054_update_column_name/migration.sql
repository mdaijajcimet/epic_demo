/*
  Warnings:

  - You are about to drop the column `range` on the `SolarAffiliate` table. All the data in the column will be lost.
  - Added the required column `capacityRangeDiff` to the `SolarAffiliate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SolarAffiliate" DROP COLUMN "range",
ADD COLUMN     "capacityRangeDiff" DECIMAL(18,4) NOT NULL;
