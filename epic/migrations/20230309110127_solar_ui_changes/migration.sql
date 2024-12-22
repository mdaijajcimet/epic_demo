-- AlterTable
ALTER TABLE "InstallerAddon" ADD COLUMN     "installer" TEXT;

-- AlterTable
ALTER TABLE "InstallerBattery" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "InstallerInverter" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "InstallerLicence" ADD COLUMN     "installer" TEXT;

-- AlterTable
ALTER TABLE "InstallerSolarPanel" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "InstallerAddon_installer_idx" ON "InstallerAddon"("installer");

-- CreateIndex
CREATE INDEX "InstallerLicence_installer_idx" ON "InstallerLicence"("installer");

-- AddForeignKey
ALTER TABLE "InstallerLicence" ADD CONSTRAINT "InstallerLicence_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerAddon" ADD CONSTRAINT "InstallerAddon_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
