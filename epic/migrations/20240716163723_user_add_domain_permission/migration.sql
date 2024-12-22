-- CreateTable
CREATE TABLE "_User_assignedDomains" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_User_assignedDomains_AB_unique" ON "_User_assignedDomains"("A", "B");

-- CreateIndex
CREATE INDEX "_User_assignedDomains_B_index" ON "_User_assignedDomains"("B");

-- AddForeignKey
ALTER TABLE "_User_assignedDomains" ADD CONSTRAINT "_User_assignedDomains_A_fkey" FOREIGN KEY ("A") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_User_assignedDomains" ADD CONSTRAINT "_User_assignedDomains_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
