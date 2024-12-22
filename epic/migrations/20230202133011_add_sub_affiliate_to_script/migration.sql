-- CreateTable
CREATE TABLE "_Script_subAffiliates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Script_subAffiliates_AB_unique" ON "_Script_subAffiliates"("A", "B");

-- CreateIndex
CREATE INDEX "_Script_subAffiliates_B_index" ON "_Script_subAffiliates"("B");

-- AddForeignKey
ALTER TABLE "_Script_subAffiliates" ADD CONSTRAINT "_Script_subAffiliates_A_fkey" FOREIGN KEY ("A") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Script_subAffiliates" ADD CONSTRAINT "_Script_subAffiliates_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
