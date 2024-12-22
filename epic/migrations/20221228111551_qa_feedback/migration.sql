/*
  Warnings:

  - Made the column `providerId` on table `Provider` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Provider" ALTER COLUMN "providerId" SET NOT NULL;
