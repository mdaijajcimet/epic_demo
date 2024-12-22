/*
  Warnings:

  - You are about to drop the column `type` on the `FormField` table. All the data in the column will be lost.
  - You are about to drop the `_Affiliate_subAffiliates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Affiliate_subAffiliates" DROP CONSTRAINT "_Affiliate_subAffiliates_A_fkey";

-- DropForeignKey
ALTER TABLE "_Affiliate_subAffiliates" DROP CONSTRAINT "_Affiliate_subAffiliates_B_fkey";

-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FormComponent" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "defaultProps" JSONB DEFAULT '{}',
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FormContainer" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "defaultProps" JSONB DEFAULT '{}',
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FormField" DROP COLUMN "type",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "defaultProps" JSONB DEFAULT '{}',
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SubAffiliate" ADD COLUMN     "affiliate" TEXT;

-- DropTable
DROP TABLE "_Affiliate_subAffiliates";

-- CreateIndex
CREATE INDEX "SubAffiliate_affiliate_idx" ON "SubAffiliate"("affiliate");

-- AddForeignKey
ALTER TABLE "SubAffiliate" ADD CONSTRAINT "SubAffiliate_affiliate_fkey" FOREIGN KEY ("affiliate") REFERENCES "Affiliate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
