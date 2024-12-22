/*
  Warnings:

  - Made the column `cost` on table `InstallerBattery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warranty` on table `InstallerBattery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warrantyClaims` on table `InstallerBattery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cost` on table `InstallerInverter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warranty` on table `InstallerInverter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warrantyClaims` on table `InstallerInverter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cost` on table `InstallerSolarPanel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warranty` on table `InstallerSolarPanel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warrantyClaims` on table `InstallerSolarPanel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "InstallerBattery" ALTER COLUMN "cost" SET NOT NULL,
ALTER COLUMN "warranty" SET NOT NULL,
ALTER COLUMN "warrantyClaims" SET NOT NULL;

-- AlterTable
ALTER TABLE "InstallerInverter" ALTER COLUMN "cost" SET NOT NULL,
ALTER COLUMN "warranty" SET NOT NULL,
ALTER COLUMN "warrantyClaims" SET NOT NULL;

-- AlterTable
ALTER TABLE "InstallerSolarPanel" ALTER COLUMN "cost" SET NOT NULL,
ALTER COLUMN "warranty" SET NOT NULL,
ALTER COLUMN "warrantyClaims" SET NOT NULL;
