-- CreateTable
CREATE TABLE "ProductTier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HospitalCover" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HospitalCover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtrasCover" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExtrasCover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HospitalCover_productTiers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductTier_name_key" ON "ProductTier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HospitalCover_name_key" ON "HospitalCover"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExtrasCover_name_key" ON "ExtrasCover"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_HospitalCover_productTiers_AB_unique" ON "_HospitalCover_productTiers"("A", "B");

-- CreateIndex
CREATE INDEX "_HospitalCover_productTiers_B_index" ON "_HospitalCover_productTiers"("B");

-- AddForeignKey
ALTER TABLE "_HospitalCover_productTiers" ADD CONSTRAINT "_HospitalCover_productTiers_A_fkey" FOREIGN KEY ("A") REFERENCES "HospitalCover"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HospitalCover_productTiers" ADD CONSTRAINT "_HospitalCover_productTiers_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
