-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "openEnergyBillRule" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "OpenEnergyBillRule" (
    "id" TEXT NOT NULL,
    "transactionUType" TEXT NOT NULL,
    "field" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL DEFAULT '',
    "isExclusive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenEnergyBillRule_pkey" PRIMARY KEY ("id")
);
