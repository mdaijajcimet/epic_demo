-- CreateEnum
CREATE TYPE "IgnoreListTaggedAType" AS ENUM ('testData', 'spamData');

-- CreateTable
CREATE TABLE "IgnoreList" (
    "id" TEXT NOT NULL,
    "parameter" TEXT,
    "parameterData" TEXT,
    "parameterContent" TEXT NOT NULL DEFAULT '',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "taggedAs" "IgnoreListTaggedAType" NOT NULL,
    "comments" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "IgnoreList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IgnoreParameter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "assignedDataCount" INTEGER DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "comments" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IgnoreParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IgnoreType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "assignedDataCount" INTEGER DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "comments" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IgnoreType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IgnoreDataContent" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "IgnoreDataContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IgnoreList_type" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IgnoreParameter_type" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IgnoreParameter_typeData" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IgnoreType_parameterData" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "IgnoreList_parameter_idx" ON "IgnoreList"("parameter");

-- CreateIndex
CREATE INDEX "IgnoreList_parameterData_idx" ON "IgnoreList"("parameterData");

-- CreateIndex
CREATE UNIQUE INDEX "IgnoreDataContent_text_key" ON "IgnoreDataContent"("text");

-- CreateIndex
CREATE UNIQUE INDEX "_IgnoreList_type_AB_unique" ON "_IgnoreList_type"("A", "B");

-- CreateIndex
CREATE INDEX "_IgnoreList_type_B_index" ON "_IgnoreList_type"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IgnoreParameter_type_AB_unique" ON "_IgnoreParameter_type"("A", "B");

-- CreateIndex
CREATE INDEX "_IgnoreParameter_type_B_index" ON "_IgnoreParameter_type"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IgnoreParameter_typeData_AB_unique" ON "_IgnoreParameter_typeData"("A", "B");

-- CreateIndex
CREATE INDEX "_IgnoreParameter_typeData_B_index" ON "_IgnoreParameter_typeData"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IgnoreType_parameterData_AB_unique" ON "_IgnoreType_parameterData"("A", "B");

-- CreateIndex
CREATE INDEX "_IgnoreType_parameterData_B_index" ON "_IgnoreType_parameterData"("B");

-- AddForeignKey
ALTER TABLE "IgnoreList" ADD CONSTRAINT "IgnoreList_parameter_fkey" FOREIGN KEY ("parameter") REFERENCES "IgnoreParameter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IgnoreList" ADD CONSTRAINT "IgnoreList_parameterData_fkey" FOREIGN KEY ("parameterData") REFERENCES "IgnoreDataContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IgnoreList_type" ADD CONSTRAINT "_IgnoreList_type_A_fkey" FOREIGN KEY ("A") REFERENCES "IgnoreList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IgnoreList_type" ADD CONSTRAINT "_IgnoreList_type_B_fkey" FOREIGN KEY ("B") REFERENCES "IgnoreType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IgnoreParameter_type" ADD CONSTRAINT "_IgnoreParameter_type_A_fkey" FOREIGN KEY ("A") REFERENCES "IgnoreParameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IgnoreParameter_type" ADD CONSTRAINT "_IgnoreParameter_type_B_fkey" FOREIGN KEY ("B") REFERENCES "IgnoreType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IgnoreParameter_typeData" ADD CONSTRAINT "_IgnoreParameter_typeData_A_fkey" FOREIGN KEY ("A") REFERENCES "IgnoreDataContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IgnoreParameter_typeData" ADD CONSTRAINT "_IgnoreParameter_typeData_B_fkey" FOREIGN KEY ("B") REFERENCES "IgnoreParameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IgnoreType_parameterData" ADD CONSTRAINT "_IgnoreType_parameterData_A_fkey" FOREIGN KEY ("A") REFERENCES "IgnoreDataContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IgnoreType_parameterData" ADD CONSTRAINT "_IgnoreType_parameterData_B_fkey" FOREIGN KEY ("B") REFERENCES "IgnoreType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
