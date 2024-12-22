/*
  Warnings:

  - You are about to drop the column `rewardProgram` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeMcATM` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeMcDollar` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeMcPercent` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `fxFeeVisaAtm` on the `CreditCardFee` table. All the data in the column will be lost.
  - You are about to drop the column `isFrequentFluer` on the `RewardProgram` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_rewardProgram_fkey";

-- DropIndex
DROP INDEX "CreditCard_rewardProgram_idx";

-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "rewardProgram",
ADD COLUMN     "isDiscontinued" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CreditCardFee" DROP COLUMN "fxFeeMcATM",
DROP COLUMN "fxFeeMcDollar",
DROP COLUMN "fxFeeMcPercent",
DROP COLUMN "fxFeeVisaAtm",
ADD COLUMN     "fxFeeMCATM" INTEGER,
ADD COLUMN     "fxFeeMCDollar" INTEGER,
ADD COLUMN     "fxFeeMCPercent" DECIMAL(4,2),
ADD COLUMN     "fxFeeVisaATM" INTEGER;

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Redemption" ALTER COLUMN "type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RewardProgram" DROP COLUMN "isFrequentFluer",
ADD COLUMN     "isFrequentFlyer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "partner" TEXT;

-- CreateTable
CREATE TABLE "PartnerProgram" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "conversionRate" DOUBLE PRECISION,

    CONSTRAINT "PartnerProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CreditCard_rewardPrograms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PartnerProgram_name_key" ON "PartnerProgram"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CreditCard_rewardPrograms_AB_unique" ON "_CreditCard_rewardPrograms"("A", "B");

-- CreateIndex
CREATE INDEX "_CreditCard_rewardPrograms_B_index" ON "_CreditCard_rewardPrograms"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE INDEX "RewardProgram_partner_idx" ON "RewardProgram"("partner");

-- AddForeignKey
ALTER TABLE "RewardProgram" ADD CONSTRAINT "RewardProgram_partner_fkey" FOREIGN KEY ("partner") REFERENCES "PartnerProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_rewardPrograms" ADD CONSTRAINT "_CreditCard_rewardPrograms_A_fkey" FOREIGN KEY ("A") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_rewardPrograms" ADD CONSTRAINT "_CreditCard_rewardPrograms_B_fkey" FOREIGN KEY ("B") REFERENCES "RewardProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
