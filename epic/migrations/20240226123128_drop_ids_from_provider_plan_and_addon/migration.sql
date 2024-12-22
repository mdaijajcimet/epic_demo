/*
  Warnings:

  - You are about to drop the column `addonId` on the `GenericAddon` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `GenericPlan` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `GenericProvider` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "GenericAddon_addonId_key";

-- DropIndex
DROP INDEX "GenericPlan_planId_key";

-- DropIndex
DROP INDEX "GenericProvider_providerId_key";

-- AlterTable
ALTER TABLE "GenericAddon" DROP COLUMN "addonId";

-- AlterTable
ALTER TABLE "GenericPlan" DROP COLUMN "planId",
ADD COLUMN     "label" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "GenericPlanField" ADD COLUMN     "tooltip" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "GenericProvider" DROP COLUMN "providerId";
