-- AlterTable
ALTER TABLE "Installer" ADD COLUMN     "nextStepGuidance" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]';

-- CreateTable
CREATE TABLE "StateWiseRebate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "state" TEXT,
    "rebateType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "condition" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',

    CONSTRAINT "StateWiseRebate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StateWiseRebate_state_idx" ON "StateWiseRebate"("state");

-- AddForeignKey
ALTER TABLE "StateWiseRebate" ADD CONSTRAINT "StateWiseRebate_state_fkey" FOREIGN KEY ("state") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;
