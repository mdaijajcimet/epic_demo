-- CreateTable
CREATE TABLE "_CreditCard_subAffiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Installer_subAffiliates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FormContainer_subAffiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CreditCard_subAffiliate_AB_unique" ON "_CreditCard_subAffiliate"("A", "B");

-- CreateIndex
CREATE INDEX "_CreditCard_subAffiliate_B_index" ON "_CreditCard_subAffiliate"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Installer_subAffiliates_AB_unique" ON "_Installer_subAffiliates"("A", "B");

-- CreateIndex
CREATE INDEX "_Installer_subAffiliates_B_index" ON "_Installer_subAffiliates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FormContainer_subAffiliate_AB_unique" ON "_FormContainer_subAffiliate"("A", "B");

-- CreateIndex
CREATE INDEX "_FormContainer_subAffiliate_B_index" ON "_FormContainer_subAffiliate"("B");

-- AddForeignKey
ALTER TABLE "_CreditCard_subAffiliate" ADD CONSTRAINT "_CreditCard_subAffiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_subAffiliate" ADD CONSTRAINT "_CreditCard_subAffiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_subAffiliates" ADD CONSTRAINT "_Installer_subAffiliates_A_fkey" FOREIGN KEY ("A") REFERENCES "Installer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Installer_subAffiliates" ADD CONSTRAINT "_Installer_subAffiliates_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormContainer_subAffiliate" ADD CONSTRAINT "_FormContainer_subAffiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "FormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormContainer_subAffiliate" ADD CONSTRAINT "_FormContainer_subAffiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
