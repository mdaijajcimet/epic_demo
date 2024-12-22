-- AlterTable
ALTER TABLE "SolarBundle" ADD COLUMN     "costPerMonth" DOUBLE PRECISION,
ADD COLUMN     "durationMonths" DOUBLE PRECISION,
ADD COLUMN     "energyPlanIncluded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "energyPlanName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "subscriptionIncluded" BOOLEAN NOT NULL DEFAULT false;
