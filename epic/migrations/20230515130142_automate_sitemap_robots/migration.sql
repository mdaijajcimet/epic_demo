-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "lastModified" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "seoIndex" TEXT DEFAULT 'allowed';
