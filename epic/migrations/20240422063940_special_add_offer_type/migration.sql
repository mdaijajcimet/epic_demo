-- AlterTable
ALTER TABLE "PLSpecial" ADD COLUMN     "offerType" TEXT NOT NULL DEFAULT 'offer';

-- AlterTable
ALTER TABLE "Special" ADD COLUMN     "offerType" TEXT NOT NULL DEFAULT 'offer';
