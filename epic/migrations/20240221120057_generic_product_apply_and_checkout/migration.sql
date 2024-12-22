-- AlterTable
ALTER TABLE "GenericPlan" ADD COLUMN     "agentApplyStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "applyNowContent" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "applyStatus" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "clickoutStatus" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "clickoutURL" TEXT,
ADD COLUMN     "inboundCallStatus" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "GenericProvider" ADD COLUMN     "applyNowContent" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "applyStatus" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "GenericPlan_clickoutURL_idx" ON "GenericPlan"("clickoutURL");

-- AddForeignKey
ALTER TABLE "GenericPlan" ADD CONSTRAINT "GenericPlan_clickoutURL_fkey" FOREIGN KEY ("clickoutURL") REFERENCES "GenericPlanField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
