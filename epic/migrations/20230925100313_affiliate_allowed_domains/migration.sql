-- AlterTable
ALTER TABLE "Affiliate" ADD COLUMN     "emailDomains" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SubAffiliate" ADD COLUMN     "emailDomains" TEXT NOT NULL DEFAULT '';
