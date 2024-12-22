/*
  Warnings:

  - You are about to drop the column `name` on the `AddonAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `const` on the `Battery` table. All the data in the column will be lost.
  - You are about to drop the column `installer` on the `InstallerLicense` table. All the data in the column will be lost.
  - You are about to drop the column `inverter` on the `InstallerSolarPanel` table. All the data in the column will be lost.
  - You are about to drop the column `bundle` on the `SolarAddon` table. All the data in the column will be lost.
  - You are about to drop the column `const` on the `SolarAddon` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[attribute]` on the table `AddonAttribute` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InstallerLicense" DROP CONSTRAINT "InstallerLicense_installer_fkey";

-- DropForeignKey
ALTER TABLE "InstallerSolarPanel" DROP CONSTRAINT "InstallerSolarPanel_inverter_fkey";

-- DropForeignKey
ALTER TABLE "SolarAddon" DROP CONSTRAINT "SolarAddon_bundle_fkey";

-- DropIndex
DROP INDEX "AddonAttribute_name_key";

-- DropIndex
DROP INDEX "InstallerLicense_installer_idx";

-- DropIndex
DROP INDEX "InstallerSolarPanel_inverter_idx";

-- DropIndex
DROP INDEX "SolarAddon_bundle_idx";

-- AlterTable
ALTER TABLE "AddonAttribute" DROP COLUMN "name",
ADD COLUMN     "attribute" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Battery" DROP COLUMN "const",
ADD COLUMN     "cost" DECIMAL(4,2);

-- AlterTable
ALTER TABLE "InstallerLicense" DROP COLUMN "installer";

-- AlterTable
ALTER TABLE "InstallerSolarPanel" DROP COLUMN "inverter",
ADD COLUMN     "solarPanel" TEXT;

-- AlterTable
ALTER TABLE "SolarAddon" DROP COLUMN "bundle",
DROP COLUMN "const";

-- CreateTable
CREATE TABLE "InstallerAddon" (
    "id" TEXT NOT NULL,
    "installer" TEXT,
    "addon" TEXT,
    "cost" DOUBLE PRECISION,

    CONSTRAINT "InstallerAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Installer_licence" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "InstallerAddon_installer_idx" ON "InstallerAddon"("installer");

-- CreateIndex
CREATE INDEX "InstallerAddon_addon_idx" ON "InstallerAddon"("addon");

-- CreateIndex
CREATE UNIQUE INDEX "_Installer_licence_AB_unique" ON "_Installer_licence"("A", "B");

-- CreateIndex
CREATE INDEX "_Installer_licence_B_index" ON "_Installer_licence"("B");

-- CreateIndex
CREATE UNIQUE INDEX "AddonAttribute_attribute_key" ON "AddonAttribute"("attribute");

-- CreateIndex
CREATE INDEX "InstallerSolarPanel_solarPanel_idx" ON "InstallerSolarPanel"("solarPanel");

-- AddForeignKey
ALTER TABLE "InstallerSolarPanel" ADD CONSTRAINT "InstallerSolarPanel_solarPanel_fkey" FOREIGN KEY ("solarPanel") REFERENCES "SolarPanel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerAddon" ADD CONSTRAINT "InstallerAddon_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerAddon" ADD CONSTRAINT "InstallerAddon_addon_fkey" FOREIGN KEY ("addon") REFERENCES "SolarAddon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_licence" ADD CONSTRAINT "_Installer_licence_A_fkey" FOREIGN KEY ("A") REFERENCES "Installer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_licence" ADD CONSTRAINT "_Installer_licence_B_fkey" FOREIGN KEY ("B") REFERENCES "InstallerLicense"("id") ON DELETE CASCADE ON UPDATE CASCADE;
