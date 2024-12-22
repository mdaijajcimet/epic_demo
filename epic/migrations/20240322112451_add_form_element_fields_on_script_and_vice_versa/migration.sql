-- CreateTable
CREATE TABLE "_FormContainer_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FormComponent_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FormField_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FormContainer_scripts_AB_unique" ON "_FormContainer_scripts"("A", "B");

-- CreateIndex
CREATE INDEX "_FormContainer_scripts_B_index" ON "_FormContainer_scripts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FormComponent_scripts_AB_unique" ON "_FormComponent_scripts"("A", "B");

-- CreateIndex
CREATE INDEX "_FormComponent_scripts_B_index" ON "_FormComponent_scripts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FormField_scripts_AB_unique" ON "_FormField_scripts"("A", "B");

-- CreateIndex
CREATE INDEX "_FormField_scripts_B_index" ON "_FormField_scripts"("B");

-- AddForeignKey
ALTER TABLE "_FormContainer_scripts" ADD CONSTRAINT "_FormContainer_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "FormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormContainer_scripts" ADD CONSTRAINT "_FormContainer_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormComponent_scripts" ADD CONSTRAINT "_FormComponent_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "FormComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormComponent_scripts" ADD CONSTRAINT "_FormComponent_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormField_scripts" ADD CONSTRAINT "_FormField_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "FormField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormField_scripts" ADD CONSTRAINT "_FormField_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;
