/*
  Warnings:

  - You are about to drop the column `eligibility` on the `PersonalLoan` table. All the data in the column will be lost.
  - You are about to drop the column `loanType` on the `PersonalLoan` table. All the data in the column will be lost.
  - You are about to drop the `_PersonalLoan_perks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PersonalLoan_specials` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[personalLoan]` on the table `Eligibility` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PersonalLoan" DROP CONSTRAINT "PersonalLoan_eligibility_fkey";

-- DropForeignKey
ALTER TABLE "_PersonalLoan_perks" DROP CONSTRAINT "_PersonalLoan_perks_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonalLoan_perks" DROP CONSTRAINT "_PersonalLoan_perks_B_fkey";

-- DropForeignKey
ALTER TABLE "_PersonalLoan_specials" DROP CONSTRAINT "_PersonalLoan_specials_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonalLoan_specials" DROP CONSTRAINT "_PersonalLoan_specials_B_fkey";

-- DropIndex
DROP INDEX "PersonalLoan_eligibility_idx";

-- AlterTable
ALTER TABLE "Eligibility" ADD COLUMN     "personalLoan" TEXT;

-- AlterTable
ALTER TABLE "PLFeature" ADD COLUMN     "featureDescription" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "PLFee" ADD COLUMN     "securityFee" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Perk" ADD COLUMN     "personalLoan" TEXT;

-- AlterTable
ALTER TABLE "PersonalLoan" DROP COLUMN "eligibility",
DROP COLUMN "loanType",
ADD COLUMN     "interestType" TEXT NOT NULL DEFAULT 'fixed',
ADD COLUMN     "otherInformation" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "repaymentFrequency" JSONB NOT NULL DEFAULT '["monthly","fortnightly","weekly"]';

-- AlterTable
ALTER TABLE "Special" ADD COLUMN     "personalLoan" TEXT;

-- DropTable
DROP TABLE "_PersonalLoan_perks";

-- DropTable
DROP TABLE "_PersonalLoan_specials";

-- CreateTable
CREATE TABLE "_PersonalLoan_document" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PersonalLoan_document_AB_unique" ON "_PersonalLoan_document"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonalLoan_document_B_index" ON "_PersonalLoan_document"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Eligibility_personalLoan_key" ON "Eligibility"("personalLoan");

-- CreateIndex
CREATE INDEX "Perk_personalLoan_idx" ON "Perk"("personalLoan");

-- CreateIndex
CREATE INDEX "Special_personalLoan_idx" ON "Special"("personalLoan");

-- AddForeignKey
ALTER TABLE "Eligibility" ADD CONSTRAINT "Eligibility_personalLoan_fkey" FOREIGN KEY ("personalLoan") REFERENCES "PersonalLoan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perk" ADD CONSTRAINT "Perk_personalLoan_fkey" FOREIGN KEY ("personalLoan") REFERENCES "PersonalLoan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Special" ADD CONSTRAINT "Special_personalLoan_fkey" FOREIGN KEY ("personalLoan") REFERENCES "PersonalLoan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalLoan_document" ADD CONSTRAINT "_PersonalLoan_document_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalLoan_document" ADD CONSTRAINT "_PersonalLoan_document_B_fkey" FOREIGN KEY ("B") REFERENCES "PersonalLoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
