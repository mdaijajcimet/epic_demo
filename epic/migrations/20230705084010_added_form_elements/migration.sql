-- CreateEnum
CREATE TYPE "FormFieldComponentType" AS ENUM ('Input', 'Select', 'CheckBox', 'DateInput', 'AddressInput', 'Title', 'InforBar', 'IssuingCountry');

-- CreateTable
CREATE TABLE "FormComponent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "key" TEXT,
    "label" TEXT NOT NULL DEFAULT '',
    "tooltip" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "FormComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormContainer" (
    "id" TEXT NOT NULL,
    "vertical" TEXT,
    "page" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "FormContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "label" TEXT NOT NULL DEFAULT '',
    "key" TEXT NOT NULL DEFAULT '',
    "placeholder" TEXT NOT NULL DEFAULT '',
    "component" "FormFieldComponentType",
    "type" TEXT NOT NULL DEFAULT '',
    "tooltip" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "FormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FormComponent_fields" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FormContainer_formComponents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FormField_subComponents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FormContainer_provider" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "FormContainer_vertical_idx" ON "FormContainer"("vertical");

-- CreateIndex
CREATE UNIQUE INDEX "_FormComponent_fields_AB_unique" ON "_FormComponent_fields"("A", "B");

-- CreateIndex
CREATE INDEX "_FormComponent_fields_B_index" ON "_FormComponent_fields"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FormContainer_formComponents_AB_unique" ON "_FormContainer_formComponents"("A", "B");

-- CreateIndex
CREATE INDEX "_FormContainer_formComponents_B_index" ON "_FormContainer_formComponents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FormField_subComponents_AB_unique" ON "_FormField_subComponents"("A", "B");

-- CreateIndex
CREATE INDEX "_FormField_subComponents_B_index" ON "_FormField_subComponents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FormContainer_provider_AB_unique" ON "_FormContainer_provider"("A", "B");

-- CreateIndex
CREATE INDEX "_FormContainer_provider_B_index" ON "_FormContainer_provider"("B");

-- AddForeignKey
ALTER TABLE "FormContainer" ADD CONSTRAINT "FormContainer_vertical_fkey" FOREIGN KEY ("vertical") REFERENCES "Vertical"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormComponent_fields" ADD CONSTRAINT "_FormComponent_fields_A_fkey" FOREIGN KEY ("A") REFERENCES "FormComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormComponent_fields" ADD CONSTRAINT "_FormComponent_fields_B_fkey" FOREIGN KEY ("B") REFERENCES "FormField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormContainer_formComponents" ADD CONSTRAINT "_FormContainer_formComponents_A_fkey" FOREIGN KEY ("A") REFERENCES "FormComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormContainer_formComponents" ADD CONSTRAINT "_FormContainer_formComponents_B_fkey" FOREIGN KEY ("B") REFERENCES "FormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormField_subComponents" ADD CONSTRAINT "_FormField_subComponents_A_fkey" FOREIGN KEY ("A") REFERENCES "FormComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormField_subComponents" ADD CONSTRAINT "_FormField_subComponents_B_fkey" FOREIGN KEY ("B") REFERENCES "FormField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormContainer_provider" ADD CONSTRAINT "_FormContainer_provider_A_fkey" FOREIGN KEY ("A") REFERENCES "FormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormContainer_provider" ADD CONSTRAINT "_FormContainer_provider_B_fkey" FOREIGN KEY ("B") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
