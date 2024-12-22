/*
  Warnings:

  - You are about to drop the column `installer` on the `InstallerAddon` table. All the data in the column will be lost.
  - Made the column `name` on table `InstallerAddon` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "InstallerAddon" DROP CONSTRAINT "InstallerAddon_installer_fkey";

-- DropForeignKey
ALTER TABLE "InstallerAddon" DROP CONSTRAINT "InstallerAddon_name_fkey";

-- DropIndex
DROP INDEX "InstallerAddon_installer_idx";

-- DropIndex
DROP INDEX "InstallerAddon_name_idx";

-- AlterTable
ALTER TABLE "InstallerAddon" DROP COLUMN "installer",
ADD COLUMN     "addon" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT '';

-- CreateTable
CREATE TABLE "AddonFeature" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "AddonFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SolarAddon_features" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AddonFeature_description_key" ON "AddonFeature"("description");

-- CreateIndex
CREATE UNIQUE INDEX "_SolarAddon_features_AB_unique" ON "_SolarAddon_features"("A", "B");

-- CreateIndex
CREATE INDEX "_SolarAddon_features_B_index" ON "_SolarAddon_features"("B");

-- CreateIndex
CREATE INDEX "InstallerAddon_addon_idx" ON "InstallerAddon"("addon");

-- AddForeignKey
ALTER TABLE "InstallerAddon" ADD CONSTRAINT "InstallerAddon_addon_fkey" FOREIGN KEY ("addon") REFERENCES "SolarAddon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolarAddon_features" ADD CONSTRAINT "_SolarAddon_features_A_fkey" FOREIGN KEY ("A") REFERENCES "AddonFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolarAddon_features" ADD CONSTRAINT "_SolarAddon_features_B_fkey" FOREIGN KEY ("B") REFERENCES "SolarAddon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
