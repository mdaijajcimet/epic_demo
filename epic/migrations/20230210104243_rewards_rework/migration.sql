/*
  Warnings:

  - You are about to drop the column `conversionRate` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the column `rewardProgram` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the `Partner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Program` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Redemption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RedemptionType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RewardProgram_icons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Reward_programs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_partner_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_redemption_fkey";

-- DropForeignKey
ALTER TABLE "Redemption" DROP CONSTRAINT "Redemption_type_fkey";

-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_rewardProgram_fkey";

-- DropForeignKey
ALTER TABLE "_RewardProgram_icons" DROP CONSTRAINT "_RewardProgram_icons_A_fkey";

-- DropForeignKey
ALTER TABLE "_RewardProgram_icons" DROP CONSTRAINT "_RewardProgram_icons_B_fkey";

-- DropForeignKey
ALTER TABLE "_Reward_programs" DROP CONSTRAINT "_Reward_programs_A_fkey";

-- DropForeignKey
ALTER TABLE "_Reward_programs" DROP CONSTRAINT "_Reward_programs_B_fkey";

-- DropIndex
DROP INDEX "Reward_rewardProgram_idx";

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "conversionRate",
DROP COLUMN "rewardProgram",
ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "RewardProgram" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "pointsCondition" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "rewardPointsExpiry" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "Partner";

-- DropTable
DROP TABLE "Program";

-- DropTable
DROP TABLE "Redemption";

-- DropTable
DROP TABLE "RedemptionType";

-- DropTable
DROP TABLE "_RewardProgram_icons";

-- DropTable
DROP TABLE "_Reward_programs";

-- CreateIndex
CREATE INDEX "RewardProgram_icon_idx" ON "RewardProgram"("icon");

-- AddForeignKey
ALTER TABLE "RewardProgram" ADD CONSTRAINT "RewardProgram_icon_fkey" FOREIGN KEY ("icon") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
