/*
  Warnings:

  - You are about to drop the column `pointsRequired` on the `Redemption` table. All the data in the column will be lost.
  - You are about to drop the column `rewardPointsExpiry` on the `Redemption` table. All the data in the column will be lost.
  - You are about to drop the column `rewardProgram` on the `Redemption` table. All the data in the column will be lost.
  - You are about to drop the column `partner` on the `RewardProgram` table. All the data in the column will be lost.
  - You are about to drop the `PartnerProgram` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Redemption" DROP CONSTRAINT "Redemption_rewardProgram_fkey";

-- DropForeignKey
ALTER TABLE "RewardProgram" DROP CONSTRAINT "RewardProgram_partner_fkey";

-- DropIndex
DROP INDEX "Redemption_rewardProgram_idx";

-- DropIndex
DROP INDEX "Redemption_type_key";

-- DropIndex
DROP INDEX "RewardProgram_partner_idx";

-- AlterTable
ALTER TABLE "Redemption" DROP COLUMN "pointsRequired",
DROP COLUMN "rewardPointsExpiry",
DROP COLUMN "rewardProgram",
ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RewardProgram" DROP COLUMN "partner";

-- DropTable
DROP TABLE "PartnerProgram";

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "redemption" TEXT,
    "pointsRequired" INTEGER NOT NULL,
    "rewardPointsExpiry" TEXT NOT NULL DEFAULT '',
    "partner" TEXT,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedemptionType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "RedemptionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "rewardProgram" TEXT,
    "conversionRate" DECIMAL(4,2) DEFAULT 1.0,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Reward_programs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RewardProgram_rewards" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE INDEX "Program_redemption_idx" ON "Program"("redemption");

-- CreateIndex
CREATE INDEX "Program_partner_idx" ON "Program"("partner");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_name_key" ON "Partner"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RedemptionType_name_key" ON "RedemptionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Reward_name_key" ON "Reward"("name");

-- CreateIndex
CREATE INDEX "Reward_rewardProgram_idx" ON "Reward"("rewardProgram");

-- CreateIndex
CREATE UNIQUE INDEX "_Reward_programs_AB_unique" ON "_Reward_programs"("A", "B");

-- CreateIndex
CREATE INDEX "_Reward_programs_B_index" ON "_Reward_programs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RewardProgram_rewards_AB_unique" ON "_RewardProgram_rewards"("A", "B");

-- CreateIndex
CREATE INDEX "_RewardProgram_rewards_B_index" ON "_RewardProgram_rewards"("B");

-- CreateIndex
CREATE INDEX "Redemption_type_idx" ON "Redemption"("type");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_redemption_fkey" FOREIGN KEY ("redemption") REFERENCES "Redemption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_partner_fkey" FOREIGN KEY ("partner") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_type_fkey" FOREIGN KEY ("type") REFERENCES "RedemptionType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_rewardProgram_fkey" FOREIGN KEY ("rewardProgram") REFERENCES "RewardProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Reward_programs" ADD CONSTRAINT "_Reward_programs_A_fkey" FOREIGN KEY ("A") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Reward_programs" ADD CONSTRAINT "_Reward_programs_B_fkey" FOREIGN KEY ("B") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RewardProgram_rewards" ADD CONSTRAINT "_RewardProgram_rewards_A_fkey" FOREIGN KEY ("A") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RewardProgram_rewards" ADD CONSTRAINT "_RewardProgram_rewards_B_fkey" FOREIGN KEY ("B") REFERENCES "RewardProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
