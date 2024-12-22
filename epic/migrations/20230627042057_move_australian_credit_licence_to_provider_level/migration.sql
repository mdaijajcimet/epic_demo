/*
  Warnings:

  - You are about to drop the column `australianCreditLicence` on the `CreditCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "australianCreditLicence";

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "australianCreditLicence" INTEGER;
