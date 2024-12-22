/*
  Warnings:

  - You are about to drop the column `minCreditScore` on the `CreditCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "minCreditScore";

-- CreateTable
CREATE TABLE "CreditScore" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "creditBureau" TEXT,
    "scoreBand" TEXT,
    "minCreditScore" INTEGER NOT NULL DEFAULT 0,
    "maxCreditScore" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CreditScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CreditCard_creditScores" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CreditCard_creditScores_AB_unique" ON "_CreditCard_creditScores"("A", "B");

-- CreateIndex
CREATE INDEX "_CreditCard_creditScores_B_index" ON "_CreditCard_creditScores"("B");

-- AddForeignKey
ALTER TABLE "_CreditCard_creditScores" ADD CONSTRAINT "_CreditCard_creditScores_A_fkey" FOREIGN KEY ("A") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_creditScores" ADD CONSTRAINT "_CreditCard_creditScores_B_fkey" FOREIGN KEY ("B") REFERENCES "CreditScore"("id") ON DELETE CASCADE ON UPDATE CASCADE;
