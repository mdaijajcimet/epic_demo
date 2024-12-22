/*
  Warnings:

  - You are about to drop the column `installer` on the `SolarBundle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SolarBundle" DROP CONSTRAINT "SolarBundle_installer_fkey";

-- DropIndex
DROP INDEX "SolarBundle_installer_idx";

-- AlterTable
ALTER TABLE "SolarBundle" DROP COLUMN "installer",
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "_Installer_bundles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Installer_bundles_AB_unique" ON "_Installer_bundles"("A", "B");

-- CreateIndex
CREATE INDEX "_Installer_bundles_B_index" ON "_Installer_bundles"("B");

-- AddForeignKey
ALTER TABLE "_Installer_bundles" ADD CONSTRAINT "_Installer_bundles_A_fkey" FOREIGN KEY ("A") REFERENCES "Installer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_bundles" ADD CONSTRAINT "_Installer_bundles_B_fkey" FOREIGN KEY ("B") REFERENCES "SolarBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
