/*
  Warnings:

  - You are about to alter the column `pointsEarned` on the `EarnRate` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(4,2)`.

*/
-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "calculationMethodology" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "hasCashbackOffers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "interestFreeDaysDescription" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "EarnRate" ALTER COLUMN "pointsEarned" DROP DEFAULT,
ALTER COLUMN "pointsEarned" SET DATA TYPE DECIMAL(4,2);

-- AlterTable
ALTER TABLE "Redemption" ADD COLUMN     "rewardPointsExpiry" TEXT NOT NULL DEFAULT '';
