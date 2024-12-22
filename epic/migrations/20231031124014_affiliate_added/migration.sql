/*
  Warnings:

  - You are about to drop the `FormJourney` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FormJourney_provider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FormJourney_provider" DROP CONSTRAINT "_FormJourney_provider_A_fkey";

-- DropForeignKey
ALTER TABLE "_FormJourney_provider" DROP CONSTRAINT "_FormJourney_provider_B_fkey";

-- AlterTable
ALTER TABLE "FormComponent" ADD COLUMN     "type" TEXT DEFAULT 'main';

-- AlterTable
ALTER TABLE "FormContainer" ADD COLUMN     "hasAllAffiliates" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "v2" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "FormJourney";

-- DropTable
DROP TABLE "_FormJourney_provider";

-- CreateTable
CREATE TABLE "_FormContainer_affiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FormContainer_affiliate_AB_unique" ON "_FormContainer_affiliate"("A", "B");

-- CreateIndex
CREATE INDEX "_FormContainer_affiliate_B_index" ON "_FormContainer_affiliate"("B");

-- AddForeignKey
ALTER TABLE "_FormContainer_affiliate" ADD CONSTRAINT "_FormContainer_affiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormContainer_affiliate" ADD CONSTRAINT "_FormContainer_affiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "FormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
