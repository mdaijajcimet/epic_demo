/*
  Warnings:

  - You are about to drop the column `rcCode` on the `SubAffiliate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubAffiliate" DROP COLUMN "rcCode",
ADD COLUMN     "rcCodes" TEXT NOT NULL DEFAULT '';
