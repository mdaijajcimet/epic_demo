-- CreateTable
CREATE TABLE "PaymentFrequency" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "numOfDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentFrequency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentFrequency_label_key" ON "PaymentFrequency"("label");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentFrequency_name_key" ON "PaymentFrequency"("name");
