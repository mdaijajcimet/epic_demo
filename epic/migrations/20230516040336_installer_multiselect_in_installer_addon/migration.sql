/*
  Warnings:

  - You are about to drop the column `installer` on the `InstallerAddon` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InstallerAddon" DROP CONSTRAINT "InstallerAddon_installer_fkey";

-- DropIndex
DROP INDEX "InstallerAddon_installer_idx";

-- AlterTable
ALTER TABLE "InstallerAddon" DROP COLUMN "installer";

-- CreateTable
CREATE TABLE "_InstallerAddon_installer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InstallerAddon_installer_AB_unique" ON "_InstallerAddon_installer"("A", "B");

-- CreateIndex
CREATE INDEX "_InstallerAddon_installer_B_index" ON "_InstallerAddon_installer"("B");

-- AddForeignKey
ALTER TABLE "_InstallerAddon_installer" ADD CONSTRAINT "_InstallerAddon_installer_A_fkey" FOREIGN KEY ("A") REFERENCES "Installer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstallerAddon_installer" ADD CONSTRAINT "_InstallerAddon_installer_B_fkey" FOREIGN KEY ("B") REFERENCES "InstallerAddon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
