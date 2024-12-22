/*
  Warnings:

  - You are about to drop the `_InstallerAddon_installer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_InstallerAddon_installer" DROP CONSTRAINT "_InstallerAddon_installer_A_fkey";

-- DropForeignKey
ALTER TABLE "_InstallerAddon_installer" DROP CONSTRAINT "_InstallerAddon_installer_B_fkey";

-- AlterTable
ALTER TABLE "InstallerAddon" ADD COLUMN     "installer" TEXT;

-- DropTable
DROP TABLE "_InstallerAddon_installer";

-- CreateIndex
CREATE INDEX "InstallerAddon_installer_idx" ON "InstallerAddon"("installer");

-- AddForeignKey
ALTER TABLE "InstallerAddon" ADD CONSTRAINT "InstallerAddon_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
