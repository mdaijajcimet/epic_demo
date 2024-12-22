/*
  Warnings:

  - You are about to drop the `_Installer_bundles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Installer_bundles" DROP CONSTRAINT "_Installer_bundles_A_fkey";

-- DropForeignKey
ALTER TABLE "_Installer_bundles" DROP CONSTRAINT "_Installer_bundles_B_fkey";

-- AlterTable
ALTER TABLE "SolarBundle" ADD COLUMN     "installer" TEXT;

-- DropTable
DROP TABLE "_Installer_bundles";

-- CreateIndex
CREATE INDEX "SolarBundle_installer_idx" ON "SolarBundle"("installer");

-- AddForeignKey
ALTER TABLE "SolarBundle" ADD CONSTRAINT "SolarBundle_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
