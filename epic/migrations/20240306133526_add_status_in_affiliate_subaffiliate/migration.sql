-- AlterTable
ALTER TABLE "Affiliate" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SubAffiliate" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
