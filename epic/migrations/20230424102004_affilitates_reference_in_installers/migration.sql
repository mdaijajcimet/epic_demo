-- CreateTable
CREATE TABLE "_Installer_affiliates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Installer_affiliates_AB_unique" ON "_Installer_affiliates"("A", "B");

-- CreateIndex
CREATE INDEX "_Installer_affiliates_B_index" ON "_Installer_affiliates"("B");

-- AddForeignKey
ALTER TABLE "_Installer_affiliates" ADD CONSTRAINT "_Installer_affiliates_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_affiliates" ADD CONSTRAINT "_Installer_affiliates_B_fkey" FOREIGN KEY ("B") REFERENCES "Installer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
