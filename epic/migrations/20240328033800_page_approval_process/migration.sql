/*
  Warnings:

  - Made the column `status` on table `Page` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "canEditPages" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canPublishPages" BOOLEAN NOT NULL DEFAULT false;
