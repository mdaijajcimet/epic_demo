-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "formatter" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "formatterOptions" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "_Attribute_attributes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Attribute_attributes_AB_unique" ON "_Attribute_attributes"("A", "B");

-- CreateIndex
CREATE INDEX "_Attribute_attributes_B_index" ON "_Attribute_attributes"("B");

-- AddForeignKey
ALTER TABLE "_Attribute_attributes" ADD CONSTRAINT "_Attribute_attributes_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Attribute_attributes" ADD CONSTRAINT "_Attribute_attributes_B_fkey" FOREIGN KEY ("B") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
