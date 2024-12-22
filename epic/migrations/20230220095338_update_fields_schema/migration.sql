/*
  Warnings:

  - You are about to drop the column `jsonValue` on the `Field` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Field" DROP COLUMN "jsonValue",
ADD COLUMN     "isDynamic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "key" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tooltip" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "_Field_fields" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Field_fields_AB_unique" ON "_Field_fields"("A", "B");

-- CreateIndex
CREATE INDEX "_Field_fields_B_index" ON "_Field_fields"("B");

-- AddForeignKey
ALTER TABLE "_Field_fields" ADD CONSTRAINT "_Field_fields_A_fkey" FOREIGN KEY ("A") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Field_fields" ADD CONSTRAINT "_Field_fields_B_fkey" FOREIGN KEY ("B") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;
