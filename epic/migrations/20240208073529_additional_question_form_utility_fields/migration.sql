-- AlterTable
ALTER TABLE "AdditionalQuestion" ADD COLUMN     "infoPosition" TEXT DEFAULT 'bottom',
ADD COLUMN     "infoText" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tooltip" TEXT NOT NULL DEFAULT '';
