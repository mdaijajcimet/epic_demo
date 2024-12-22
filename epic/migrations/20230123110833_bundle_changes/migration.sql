/*
  Warnings:

  - You are about to drop the column `battery` on the `SolarBundle` table. All the data in the column will be lost.
  - You are about to drop the column `inverter` on the `SolarBundle` table. All the data in the column will be lost.
  - You are about to drop the column `solarPanel` on the `SolarBundle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SolarBundle" DROP CONSTRAINT "SolarBundle_battery_fkey";

-- DropForeignKey
ALTER TABLE "SolarBundle" DROP CONSTRAINT "SolarBundle_inverter_fkey";

-- DropForeignKey
ALTER TABLE "SolarBundle" DROP CONSTRAINT "SolarBundle_solarPanel_fkey";

-- DropIndex
DROP INDEX "SolarBundle_battery_idx";

-- DropIndex
DROP INDEX "SolarBundle_inverter_idx";

-- DropIndex
DROP INDEX "SolarBundle_solarPanel_idx";

-- AlterTable
ALTER TABLE "SolarBundle" DROP COLUMN "battery",
DROP COLUMN "inverter",
DROP COLUMN "solarPanel",
ADD COLUMN     "installerBattery" TEXT,
ADD COLUMN     "installerInverter" TEXT,
ADD COLUMN     "installerPanel" TEXT;

-- CreateIndex
CREATE INDEX "SolarBundle_installerPanel_idx" ON "SolarBundle"("installerPanel");

-- CreateIndex
CREATE INDEX "SolarBundle_installerInverter_idx" ON "SolarBundle"("installerInverter");

-- CreateIndex
CREATE INDEX "SolarBundle_installerBattery_idx" ON "SolarBundle"("installerBattery");

-- AddForeignKey
ALTER TABLE "SolarBundle" ADD CONSTRAINT "SolarBundle_installerPanel_fkey" FOREIGN KEY ("installerPanel") REFERENCES "InstallerSolarPanel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarBundle" ADD CONSTRAINT "SolarBundle_installerInverter_fkey" FOREIGN KEY ("installerInverter") REFERENCES "InstallerInverter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarBundle" ADD CONSTRAINT "SolarBundle_installerBattery_fkey" FOREIGN KEY ("installerBattery") REFERENCES "InstallerBattery"("id") ON DELETE SET NULL ON UPDATE CASCADE;
