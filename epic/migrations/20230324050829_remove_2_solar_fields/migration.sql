/*
  Warnings:

  - You are about to drop the column `outputCurrent` on the `Inverter` table. All the data in the column will be lost.
  - You are about to drop the column `finalCost` on the `SolarBundle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inverter" DROP COLUMN "outputCurrent";

-- AlterTable
ALTER TABLE "SolarBundle" DROP COLUMN "finalCost";
