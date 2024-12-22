-- AlterTable
ALTER TABLE "Installer" ALTER COLUMN "logo" DROP NOT NULL,
ALTER COLUMN "logo" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Installer_logo_idx" ON "Installer"("logo");

-- AddForeignKey
ALTER TABLE "Installer" ADD CONSTRAINT "Installer_logo_fkey" FOREIGN KEY ("logo") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
