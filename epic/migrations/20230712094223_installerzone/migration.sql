-- CreateTable
CREATE TABLE "InstallerZone" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "state" TEXT,
    "postcodes" TEXT NOT NULL DEFAULT '',
    "addedCostDifference" INTEGER NOT NULL DEFAULT 0,
    "installer" TEXT,

    CONSTRAINT "InstallerZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Installer_zones" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "InstallerZone_state_idx" ON "InstallerZone"("state");

-- CreateIndex
CREATE INDEX "InstallerZone_installer_idx" ON "InstallerZone"("installer");

-- CreateIndex
CREATE UNIQUE INDEX "_Installer_zones_AB_unique" ON "_Installer_zones"("A", "B");

-- CreateIndex
CREATE INDEX "_Installer_zones_B_index" ON "_Installer_zones"("B");

-- AddForeignKey
ALTER TABLE "InstallerZone" ADD CONSTRAINT "InstallerZone_state_fkey" FOREIGN KEY ("state") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerZone" ADD CONSTRAINT "InstallerZone_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_zones" ADD CONSTRAINT "_Installer_zones_A_fkey" FOREIGN KEY ("A") REFERENCES "Installer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_zones" ADD CONSTRAINT "_Installer_zones_B_fkey" FOREIGN KEY ("B") REFERENCES "InstallerZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
