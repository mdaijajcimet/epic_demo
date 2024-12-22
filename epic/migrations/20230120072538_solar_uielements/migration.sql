/*
  Warnings:

  - You are about to drop the column `addon` on the `InstallerAddon` table. All the data in the column will be lost.
  - You are about to drop the `AddonAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BundleAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PvBundle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Attribute_components` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AddonAttribute" DROP CONSTRAINT "AddonAttribute_addon_fkey";

-- DropForeignKey
ALTER TABLE "BundleAttribute" DROP CONSTRAINT "BundleAttribute_bundle_fkey";

-- DropForeignKey
ALTER TABLE "InstallerAddon" DROP CONSTRAINT "InstallerAddon_addon_fkey";

-- DropForeignKey
ALTER TABLE "PvBundle" DROP CONSTRAINT "PvBundle_battery_fkey";

-- DropForeignKey
ALTER TABLE "PvBundle" DROP CONSTRAINT "PvBundle_installer_fkey";

-- DropForeignKey
ALTER TABLE "PvBundle" DROP CONSTRAINT "PvBundle_inverter_fkey";

-- DropForeignKey
ALTER TABLE "PvBundle" DROP CONSTRAINT "PvBundle_solarPanel_fkey";

-- DropForeignKey
ALTER TABLE "_Attribute_components" DROP CONSTRAINT "_Attribute_components_A_fkey";

-- DropForeignKey
ALTER TABLE "_Attribute_components" DROP CONSTRAINT "_Attribute_components_B_fkey";

-- DropIndex
DROP INDEX "InstallerAddon_addon_idx";

-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "component" TEXT,
ADD COLUMN     "vertical" TEXT;

-- AlterTable
ALTER TABLE "InstallerAddon" DROP COLUMN "addon",
ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "AddonAttribute";

-- DropTable
DROP TABLE "BundleAttribute";

-- DropTable
DROP TABLE "PvBundle";

-- DropTable
DROP TABLE "_Attribute_components";

-- CreateTable
CREATE TABLE "SolarBundle" (
    "id" TEXT NOT NULL,
    "installer" TEXT,
    "solarPanel" TEXT,
    "inverter" TEXT,
    "battery" TEXT,
    "totalCost" DOUBLE PRECISION,
    "stcRebate" DOUBLE PRECISION,
    "finalCost" DOUBLE PRECISION,
    "capacity" DOUBLE PRECISION,
    "numberOfPanels" INTEGER,
    "areaNeeded" INTEGER,

    CONSTRAINT "SolarBundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleFeature" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "BundleFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Container" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Battery_batteryVariations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Installer_contacts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Installer_addons" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SolarPanel_panelVariations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SolarBundle_features" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Attribute_containers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "SolarBundle_installer_idx" ON "SolarBundle"("installer");

-- CreateIndex
CREATE INDEX "SolarBundle_solarPanel_idx" ON "SolarBundle"("solarPanel");

-- CreateIndex
CREATE INDEX "SolarBundle_inverter_idx" ON "SolarBundle"("inverter");

-- CreateIndex
CREATE INDEX "SolarBundle_battery_idx" ON "SolarBundle"("battery");

-- CreateIndex
CREATE UNIQUE INDEX "BundleFeature_description_key" ON "BundleFeature"("description");

-- CreateIndex
CREATE UNIQUE INDEX "_Battery_batteryVariations_AB_unique" ON "_Battery_batteryVariations"("A", "B");

-- CreateIndex
CREATE INDEX "_Battery_batteryVariations_B_index" ON "_Battery_batteryVariations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Installer_contacts_AB_unique" ON "_Installer_contacts"("A", "B");

-- CreateIndex
CREATE INDEX "_Installer_contacts_B_index" ON "_Installer_contacts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Installer_addons_AB_unique" ON "_Installer_addons"("A", "B");

-- CreateIndex
CREATE INDEX "_Installer_addons_B_index" ON "_Installer_addons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SolarPanel_panelVariations_AB_unique" ON "_SolarPanel_panelVariations"("A", "B");

-- CreateIndex
CREATE INDEX "_SolarPanel_panelVariations_B_index" ON "_SolarPanel_panelVariations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SolarBundle_features_AB_unique" ON "_SolarBundle_features"("A", "B");

-- CreateIndex
CREATE INDEX "_SolarBundle_features_B_index" ON "_SolarBundle_features"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Attribute_containers_AB_unique" ON "_Attribute_containers"("A", "B");

-- CreateIndex
CREATE INDEX "_Attribute_containers_B_index" ON "_Attribute_containers"("B");

-- CreateIndex
CREATE INDEX "Attribute_vertical_idx" ON "Attribute"("vertical");

-- CreateIndex
CREATE INDEX "Attribute_component_idx" ON "Attribute"("component");

-- CreateIndex
CREATE INDEX "InstallerAddon_name_idx" ON "InstallerAddon"("name");

-- AddForeignKey
ALTER TABLE "SolarBundle" ADD CONSTRAINT "SolarBundle_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarBundle" ADD CONSTRAINT "SolarBundle_solarPanel_fkey" FOREIGN KEY ("solarPanel") REFERENCES "SolarPanel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarBundle" ADD CONSTRAINT "SolarBundle_inverter_fkey" FOREIGN KEY ("inverter") REFERENCES "Inverter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarBundle" ADD CONSTRAINT "SolarBundle_battery_fkey" FOREIGN KEY ("battery") REFERENCES "Battery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerAddon" ADD CONSTRAINT "InstallerAddon_name_fkey" FOREIGN KEY ("name") REFERENCES "SolarAddon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_vertical_fkey" FOREIGN KEY ("vertical") REFERENCES "Vertical"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_component_fkey" FOREIGN KEY ("component") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Battery_batteryVariations" ADD CONSTRAINT "_Battery_batteryVariations_A_fkey" FOREIGN KEY ("A") REFERENCES "Battery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Battery_batteryVariations" ADD CONSTRAINT "_Battery_batteryVariations_B_fkey" FOREIGN KEY ("B") REFERENCES "InstallerBattery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_contacts" ADD CONSTRAINT "_Installer_contacts_A_fkey" FOREIGN KEY ("A") REFERENCES "Installer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_contacts" ADD CONSTRAINT "_Installer_contacts_B_fkey" FOREIGN KEY ("B") REFERENCES "InstallerContact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_addons" ADD CONSTRAINT "_Installer_addons_A_fkey" FOREIGN KEY ("A") REFERENCES "Installer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_addons" ADD CONSTRAINT "_Installer_addons_B_fkey" FOREIGN KEY ("B") REFERENCES "InstallerAddon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolarPanel_panelVariations" ADD CONSTRAINT "_SolarPanel_panelVariations_A_fkey" FOREIGN KEY ("A") REFERENCES "InstallerSolarPanel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolarPanel_panelVariations" ADD CONSTRAINT "_SolarPanel_panelVariations_B_fkey" FOREIGN KEY ("B") REFERENCES "SolarPanel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolarBundle_features" ADD CONSTRAINT "_SolarBundle_features_A_fkey" FOREIGN KEY ("A") REFERENCES "BundleFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolarBundle_features" ADD CONSTRAINT "_SolarBundle_features_B_fkey" FOREIGN KEY ("B") REFERENCES "SolarBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Attribute_containers" ADD CONSTRAINT "_Attribute_containers_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Attribute_containers" ADD CONSTRAINT "_Attribute_containers_B_fkey" FOREIGN KEY ("B") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;
