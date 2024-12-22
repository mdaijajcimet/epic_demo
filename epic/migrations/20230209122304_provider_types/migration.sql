-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "logo" TEXT,
ADD COLUMN     "type" JSONB NOT NULL DEFAULT '[]';

-- CreateIndex
CREATE INDEX "Provider_logo_idx" ON "Provider"("logo");

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_logo_fkey" FOREIGN KEY ("logo") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
