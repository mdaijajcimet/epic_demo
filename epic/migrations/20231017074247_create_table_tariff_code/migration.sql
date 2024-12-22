-- CreateTable
CREATE TABLE "TariffCode" (
    "id" TEXT NOT NULL,
    "serialNo" TEXT NOT NULL DEFAULT '',
    "distributor" TEXT NOT NULL DEFAULT '',
    "provider" TEXT NOT NULL DEFAULT '',
    "propertyType" TEXT NOT NULL DEFAULT '',
    "states" TEXT NOT NULL DEFAULT '',
    "tariffCode" TEXT NOT NULL DEFAULT '',
    "tariffType" TEXT NOT NULL DEFAULT '',
    "vertical" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "TariffCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TariffCode_tariffCode_key" ON "TariffCode"("tariffCode");
