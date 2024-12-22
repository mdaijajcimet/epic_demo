/*
  Warnings:

  - You are about to drop the `InstallerLicense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Battery_manufacturer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Installer_batteryVariations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Installer_inverterVariations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Installer_panelVariations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Inverter_manufacturer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SolarPanel_manufacturer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InstallerLicense" DROP CONSTRAINT "InstallerLicense_state_fkey";

-- DropForeignKey
ALTER TABLE "SolarBundle" DROP CONSTRAINT "SolarBundle_battery_fkey";

-- DropForeignKey
ALTER TABLE "SolarBundle" DROP CONSTRAINT "SolarBundle_inverter_fkey";

-- DropForeignKey
ALTER TABLE "SolarBundle" DROP CONSTRAINT "SolarBundle_solarPanel_fkey";

-- DropForeignKey
ALTER TABLE "_Battery_manufacturer" DROP CONSTRAINT "_Battery_manufacturer_A_fkey";

-- DropForeignKey
ALTER TABLE "_Battery_manufacturer" DROP CONSTRAINT "_Battery_manufacturer_B_fkey";

-- DropForeignKey
ALTER TABLE "_Installer_batteryVariations" DROP CONSTRAINT "_Installer_batteryVariations_A_fkey";

-- DropForeignKey
ALTER TABLE "_Installer_batteryVariations" DROP CONSTRAINT "_Installer_batteryVariations_B_fkey";

-- DropForeignKey
ALTER TABLE "_Installer_inverterVariations" DROP CONSTRAINT "_Installer_inverterVariations_A_fkey";

-- DropForeignKey
ALTER TABLE "_Installer_inverterVariations" DROP CONSTRAINT "_Installer_inverterVariations_B_fkey";

-- DropForeignKey
ALTER TABLE "_Installer_licence" DROP CONSTRAINT "_Installer_licence_B_fkey";

-- DropForeignKey
ALTER TABLE "_Installer_panelVariations" DROP CONSTRAINT "_Installer_panelVariations_A_fkey";

-- DropForeignKey
ALTER TABLE "_Installer_panelVariations" DROP CONSTRAINT "_Installer_panelVariations_B_fkey";

-- DropForeignKey
ALTER TABLE "_Inverter_manufacturer" DROP CONSTRAINT "_Inverter_manufacturer_A_fkey";

-- DropForeignKey
ALTER TABLE "_Inverter_manufacturer" DROP CONSTRAINT "_Inverter_manufacturer_B_fkey";

-- DropForeignKey
ALTER TABLE "_SolarPanel_manufacturer" DROP CONSTRAINT "_SolarPanel_manufacturer_A_fkey";

-- DropForeignKey
ALTER TABLE "_SolarPanel_manufacturer" DROP CONSTRAINT "_SolarPanel_manufacturer_B_fkey";

-- AlterTable
ALTER TABLE "Battery" ADD COLUMN     "manufacturer" TEXT;

-- AlterTable
ALTER TABLE "InstallerBattery" ADD COLUMN     "installer" TEXT;

-- AlterTable
ALTER TABLE "InstallerInverter" ADD COLUMN     "installer" TEXT;

-- AlterTable
ALTER TABLE "InstallerSolarPanel" ADD COLUMN     "installer" TEXT;

-- AlterTable
ALTER TABLE "Inverter" ADD COLUMN     "manufacturer" TEXT;

-- AlterTable
ALTER TABLE "SolarPanel" ADD COLUMN     "manufacturer" TEXT;

-- DropTable
DROP TABLE "InstallerLicense";

-- DropTable
DROP TABLE "_Battery_manufacturer";

-- DropTable
DROP TABLE "_Installer_batteryVariations";

-- DropTable
DROP TABLE "_Installer_inverterVariations";

-- DropTable
DROP TABLE "_Installer_panelVariations";

-- DropTable
DROP TABLE "_Inverter_manufacturer";

-- DropTable
DROP TABLE "_SolarPanel_manufacturer";

-- CreateTable
CREATE TABLE "InstallerLicence" (
    "id" TEXT NOT NULL,
    "state" TEXT,
    "number" TEXT NOT NULL DEFAULT '',
    "postcodes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "InstallerLicence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstallerLicence_number_key" ON "InstallerLicence"("number");

-- CreateIndex
CREATE INDEX "InstallerLicence_state_idx" ON "InstallerLicence"("state");

-- CreateIndex
CREATE INDEX "Battery_manufacturer_idx" ON "Battery"("manufacturer");

-- CreateIndex
CREATE INDEX "InstallerBattery_installer_idx" ON "InstallerBattery"("installer");

-- CreateIndex
CREATE INDEX "InstallerInverter_installer_idx" ON "InstallerInverter"("installer");

-- CreateIndex
CREATE INDEX "InstallerSolarPanel_installer_idx" ON "InstallerSolarPanel"("installer");

-- CreateIndex
CREATE INDEX "Inverter_manufacturer_idx" ON "Inverter"("manufacturer");

-- CreateIndex
CREATE INDEX "SolarPanel_manufacturer_idx" ON "SolarPanel"("manufacturer");

-- AddForeignKey
ALTER TABLE "Battery" ADD CONSTRAINT "Battery_manufacturer_fkey" FOREIGN KEY ("manufacturer") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerLicence" ADD CONSTRAINT "InstallerLicence_state_fkey" FOREIGN KEY ("state") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerInverter" ADD CONSTRAINT "InstallerInverter_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerSolarPanel" ADD CONSTRAINT "InstallerSolarPanel_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerBattery" ADD CONSTRAINT "InstallerBattery_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inverter" ADD CONSTRAINT "Inverter_manufacturer_fkey" FOREIGN KEY ("manufacturer") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarBundle" ADD CONSTRAINT "SolarBundle_solarPanel_fkey" FOREIGN KEY ("solarPanel") REFERENCES "InstallerSolarPanel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarBundle" ADD CONSTRAINT "SolarBundle_inverter_fkey" FOREIGN KEY ("inverter") REFERENCES "InstallerInverter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarBundle" ADD CONSTRAINT "SolarBundle_battery_fkey" FOREIGN KEY ("battery") REFERENCES "InstallerBattery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarPanel" ADD CONSTRAINT "SolarPanel_manufacturer_fkey" FOREIGN KEY ("manufacturer") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_licence" ADD CONSTRAINT "_Installer_licence_B_fkey" FOREIGN KEY ("B") REFERENCES "InstallerLicence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
