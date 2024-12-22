-- AlterTable
ALTER TABLE "Installer" ADD COLUMN     "depositType" TEXT,
ADD COLUMN     "depositValue" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "InstallerAddon" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "SolarAddon" ADD COLUMN     "details" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "InstallerAddon_image_idx" ON "InstallerAddon"("image");

-- AddForeignKey
ALTER TABLE "InstallerAddon" ADD CONSTRAINT "InstallerAddon_image_fkey" FOREIGN KEY ("image") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
