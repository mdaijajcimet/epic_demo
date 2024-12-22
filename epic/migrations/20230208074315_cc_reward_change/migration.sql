/*
  Warnings:

  - You are about to drop the `_CreditCard_rewardPrograms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CreditCard_rewardPrograms" DROP CONSTRAINT "_CreditCard_rewardPrograms_A_fkey";

-- DropForeignKey
ALTER TABLE "_CreditCard_rewardPrograms" DROP CONSTRAINT "_CreditCard_rewardPrograms_B_fkey";

-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "rewardProgram" TEXT;

-- DropTable
DROP TABLE "_CreditCard_rewardPrograms";

-- CreateIndex
CREATE INDEX "CreditCard_rewardProgram_idx" ON "CreditCard"("rewardProgram");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_rewardProgram_fkey" FOREIGN KEY ("rewardProgram") REFERENCES "RewardProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;
