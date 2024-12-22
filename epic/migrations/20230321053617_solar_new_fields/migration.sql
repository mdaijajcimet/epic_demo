-- AlterTable
ALTER TABLE "Battery" ADD COLUMN     "ipRating" DOUBLE PRECISION,
ADD COLUMN     "mount" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Inverter" ADD COLUMN     "ipRating" DOUBLE PRECISION,
ADD COLUMN     "totalMPPT" INTEGER,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SolarPanel" ADD COLUMN     "ipRating" DOUBLE PRECISION,
ADD COLUMN     "solarCellType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "totalPanels" INTEGER;
