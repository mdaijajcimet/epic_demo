-- AlterTable
ALTER TABLE "Vertical" ADD COLUMN     "agentJourney" TEXT NOT NULL DEFAULT 'e2e',
ADD COLUMN     "csJourney" TEXT NOT NULL DEFAULT 'e2e',
ADD COLUMN     "journeyType" TEXT NOT NULL DEFAULT 'niche';
