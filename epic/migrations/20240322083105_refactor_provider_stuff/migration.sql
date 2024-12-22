/*
  Warnings:

  - You are about to drop the column `provider` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Provider` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_provider_fkey";

-- DropIndex
DROP INDEX "CreditCard_provider_idx";

-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "provider";

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "provider" TEXT;

-- AlterTable
ALTER TABLE "ProviderCreditCard" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "_Provider_vertical" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Provider_vertical_AB_unique" ON "_Provider_vertical"("A", "B");

-- CreateIndex
CREATE INDEX "_Provider_vertical_B_index" ON "_Provider_vertical"("B");

-- CreateIndex
CREATE INDEX "CreditCard_provider_idx" ON "CreditCard"("provider");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_provider_fkey" FOREIGN KEY ("provider") REFERENCES "ProviderCreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Provider_vertical" ADD CONSTRAINT "_Provider_vertical_A_fkey" FOREIGN KEY ("A") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Provider_vertical" ADD CONSTRAINT "_Provider_vertical_B_fkey" FOREIGN KEY ("B") REFERENCES "Vertical"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Provider" ALTER COLUMN "providerId" SET DEFAULT '',
ALTER COLUMN "providerId" SET DATA TYPE TEXT;
