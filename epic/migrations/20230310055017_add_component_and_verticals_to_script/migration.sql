-- DropForeignKey
ALTER TABLE "Script" DROP CONSTRAINT "Script_vertical_fkey";

-- Make vertical null on script
UPDATE "Script" SET "vertical" = NULL;

-- DropIndex
DROP INDEX "Script_vertical_key";

-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Script" DROP COLUMN "vertical",
ADD COLUMN     "component" TEXT,
ALTER COLUMN "brand" SET DEFAULT '[]';

-- CreateTable
CREATE TABLE "_Script_verticals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Script_verticals_AB_unique" ON "_Script_verticals"("A", "B");

-- CreateIndex
CREATE INDEX "_Script_verticals_B_index" ON "_Script_verticals"("B");

-- CreateIndex
CREATE INDEX "Script_component_idx" ON "Script"("component");

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_component_fkey" FOREIGN KEY ("component") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Script_verticals" ADD CONSTRAINT "_Script_verticals_A_fkey" FOREIGN KEY ("A") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Script_verticals" ADD CONSTRAINT "_Script_verticals_B_fkey" FOREIGN KEY ("B") REFERENCES "Vertical"("id") ON DELETE CASCADE ON UPDATE CASCADE;
