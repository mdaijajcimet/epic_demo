/*
  Warnings:

  - You are about to drop the column `installer` on the `InstallerBattery` table. All the data in the column will be lost.
  - You are about to drop the column `installer` on the `InstallerInverter` table. All the data in the column will be lost.
  - You are about to drop the column `installer` on the `InstallerSolarPanel` table. All the data in the column will be lost.
  - You are about to drop the `_Battery_batteryVariations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SolarPanel_panelVariations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InstallerBattery" DROP CONSTRAINT "InstallerBattery_installer_fkey";

-- DropForeignKey
ALTER TABLE "InstallerInverter" DROP CONSTRAINT "InstallerInverter_installer_fkey";

-- DropForeignKey
ALTER TABLE "InstallerSolarPanel" DROP CONSTRAINT "InstallerSolarPanel_installer_fkey";

-- DropForeignKey
ALTER TABLE "_Battery_batteryVariations" DROP CONSTRAINT "_Battery_batteryVariations_A_fkey";

-- DropForeignKey
ALTER TABLE "_Battery_batteryVariations" DROP CONSTRAINT "_Battery_batteryVariations_B_fkey";

-- DropForeignKey
ALTER TABLE "_SolarPanel_panelVariations" DROP CONSTRAINT "_SolarPanel_panelVariations_A_fkey";

-- DropForeignKey
ALTER TABLE "_SolarPanel_panelVariations" DROP CONSTRAINT "_SolarPanel_panelVariations_B_fkey";

-- DropIndex
DROP INDEX "InstallerBattery_installer_idx";

-- DropIndex
DROP INDEX "InstallerInverter_installer_idx";

-- DropIndex
DROP INDEX "InstallerSolarPanel_installer_idx";

-- AlterTable
ALTER TABLE "InstallerBattery" DROP COLUMN "installer";

-- AlterTable
ALTER TABLE "InstallerInverter" DROP COLUMN "installer";

-- AlterTable
ALTER TABLE "InstallerSolarPanel" DROP COLUMN "installer";

-- DropTable
DROP TABLE "_Battery_batteryVariations";

-- DropTable
DROP TABLE "_SolarPanel_panelVariations";

-- CreateTable
CREATE TABLE "_Installer_panelVariations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Installer_batteryVariations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Installer_inverterVariations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Installer_panelVariations_AB_unique" ON "_Installer_panelVariations"("A", "B");

-- CreateIndex
CREATE INDEX "_Installer_panelVariations_B_index" ON "_Installer_panelVariations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Installer_batteryVariations_AB_unique" ON "_Installer_batteryVariations"("A", "B");

-- CreateIndex
CREATE INDEX "_Installer_batteryVariations_B_index" ON "_Installer_batteryVariations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Installer_inverterVariations_AB_unique" ON "_Installer_inverterVariations"("A", "B");

-- CreateIndex
CREATE INDEX "_Installer_inverterVariations_B_index" ON "_Installer_inverterVariations"("B");

-- AddForeignKey
ALTER TABLE "_Installer_panelVariations" ADD CONSTRAINT "_Installer_panelVariations_A_fkey" FOREIGN KEY ("A") REFERENCES "Installer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_panelVariations" ADD CONSTRAINT "_Installer_panelVariations_B_fkey" FOREIGN KEY ("B") REFERENCES "InstallerSolarPanel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_batteryVariations" ADD CONSTRAINT "_Installer_batteryVariations_A_fkey" FOREIGN KEY ("A") REFERENCES "Installer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_batteryVariations" ADD CONSTRAINT "_Installer_batteryVariations_B_fkey" FOREIGN KEY ("B") REFERENCES "InstallerBattery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_inverterVariations" ADD CONSTRAINT "_Installer_inverterVariations_A_fkey" FOREIGN KEY ("A") REFERENCES "Installer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_inverterVariations" ADD CONSTRAINT "_Installer_inverterVariations_B_fkey" FOREIGN KEY ("B") REFERENCES "InstallerInverter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
