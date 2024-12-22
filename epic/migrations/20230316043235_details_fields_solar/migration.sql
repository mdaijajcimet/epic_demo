-- AlterTable
ALTER TABLE "Battery" ADD COLUMN     "detailsDoc" TEXT,
ADD COLUMN     "detailsType" TEXT;

-- AlterTable
ALTER TABLE "Inverter" ADD COLUMN     "detailsDoc" TEXT,
ADD COLUMN     "detailsType" TEXT;

-- AlterTable
ALTER TABLE "SolarAddon" ADD COLUMN     "detailsDoc" TEXT,
ADD COLUMN     "detailsType" TEXT;

-- AlterTable
ALTER TABLE "SolarPanel" ADD COLUMN     "detailsDoc" TEXT,
ADD COLUMN     "detailsType" TEXT;

-- CreateIndex
CREATE INDEX "Battery_detailsDoc_idx" ON "Battery"("detailsDoc");

-- CreateIndex
CREATE INDEX "Inverter_detailsDoc_idx" ON "Inverter"("detailsDoc");

-- CreateIndex
CREATE INDEX "SolarAddon_detailsDoc_idx" ON "SolarAddon"("detailsDoc");

-- CreateIndex
CREATE INDEX "SolarPanel_detailsDoc_idx" ON "SolarPanel"("detailsDoc");

-- AddForeignKey
ALTER TABLE "Battery" ADD CONSTRAINT "Battery_detailsDoc_fkey" FOREIGN KEY ("detailsDoc") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inverter" ADD CONSTRAINT "Inverter_detailsDoc_fkey" FOREIGN KEY ("detailsDoc") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarAddon" ADD CONSTRAINT "SolarAddon_detailsDoc_fkey" FOREIGN KEY ("detailsDoc") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarPanel" ADD CONSTRAINT "SolarPanel_detailsDoc_fkey" FOREIGN KEY ("detailsDoc") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
