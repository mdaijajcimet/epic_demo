/*
  Warnings:

  - You are about to drop the column `creditCard` on the `AdditionalQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `AdditionalQuestion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdditionalQuestion" DROP CONSTRAINT "AdditionalQuestion_creditCard_fkey";

-- DropForeignKey
ALTER TABLE "AdditionalQuestion" DROP CONSTRAINT "AdditionalQuestion_provider_fkey";

-- DropIndex
DROP INDEX "AdditionalQuestion_creditCard_idx";

-- DropIndex
DROP INDEX "AdditionalQuestion_provider_idx";

-- AlterTable
ALTER TABLE "AdditionalQuestion" DROP COLUMN "creditCard",
DROP COLUMN "provider";

-- CreateTable
CREATE TABLE "_AdditionalQuestion_creditCard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdditionalQuestion_creditCard_AB_unique" ON "_AdditionalQuestion_creditCard"("A", "B");

-- CreateIndex
CREATE INDEX "_AdditionalQuestion_creditCard_B_index" ON "_AdditionalQuestion_creditCard"("B");

-- AddForeignKey
ALTER TABLE "_AdditionalQuestion_creditCard" ADD CONSTRAINT "_AdditionalQuestion_creditCard_A_fkey" FOREIGN KEY ("A") REFERENCES "AdditionalQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdditionalQuestion_creditCard" ADD CONSTRAINT "_AdditionalQuestion_creditCard_B_fkey" FOREIGN KEY ("B") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
