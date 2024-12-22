/*
  Warnings:

  - A unique constraint covering the columns `[modelNumber]` on the table `Inverter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[modelNumber]` on the table `SolarPanel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Inverter" ALTER COLUMN "outputCurrent" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "powerRating" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "approveDate" SET DATA TYPE DATE,
ALTER COLUMN "expiryDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "SolarPanel" ALTER COLUMN "approveDate" SET DATA TYPE DATE,
ALTER COLUMN "expiryDate" SET DATA TYPE DATE;

-- CreateIndex
CREATE UNIQUE INDEX "Inverter_modelNumber_key" ON "Inverter"("modelNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SolarPanel_modelNumber_key" ON "SolarPanel"("modelNumber");
