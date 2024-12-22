/*
  Warnings:

  - You are about to drop the column `value` on the `AddonAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `recLicenseNumber` on the `InstallerLicense` table. All the data in the column will be lost.
  - The `efficiency` column on the `SolarPanel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[ccLicenseNumber]` on the table `InstallerLicense` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "InstallerLicense_recLicenseNumber_key";

-- AlterTable
ALTER TABLE "AddonAttribute" DROP COLUMN "value",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Battery" ALTER COLUMN "roundtripEfficiency" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "approveDate" SET DATA TYPE DATE,
ALTER COLUMN "expiryDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "InstallerBattery" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "image" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InstallerInverter" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "image" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InstallerLicense" DROP COLUMN "recLicenseNumber",
ADD COLUMN     "ccLicenseNumber" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "InstallerSolarPanel" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "image" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SolarPanel" DROP COLUMN "efficiency",
ADD COLUMN     "efficiency" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "InstallerBattery_image_idx" ON "InstallerBattery"("image");

-- CreateIndex
CREATE INDEX "InstallerInverter_image_idx" ON "InstallerInverter"("image");

-- CreateIndex
CREATE UNIQUE INDEX "InstallerLicense_ccLicenseNumber_key" ON "InstallerLicense"("ccLicenseNumber");

-- CreateIndex
CREATE INDEX "InstallerSolarPanel_image_idx" ON "InstallerSolarPanel"("image");

-- AddForeignKey
ALTER TABLE "InstallerInverter" ADD CONSTRAINT "InstallerInverter_image_fkey" FOREIGN KEY ("image") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerSolarPanel" ADD CONSTRAINT "InstallerSolarPanel_image_fkey" FOREIGN KEY ("image") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerBattery" ADD CONSTRAINT "InstallerBattery_image_fkey" FOREIGN KEY ("image") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
