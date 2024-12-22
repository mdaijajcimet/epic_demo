/*
  Warnings:

  - You are about to drop the column `cardType` on the `CreditCard` table. All the data in the column will be lost.
  - The `type` column on the `Perk` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `cardLevel` to the `CreditCard` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CreditCardCardLevelType" AS ENUM ('standard', 'gold', 'platinum', 'premium');

-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "cardType",
ADD COLUMN     "cardLevel" "CreditCardCardLevelType" NOT NULL;

-- AlterTable
ALTER TABLE "Perk" DROP COLUMN "type",
ADD COLUMN     "type" JSONB NOT NULL DEFAULT '[]';

-- DropEnum
DROP TYPE "CreditCardCardTypeType";
