/*
  Warnings:

  - You are about to drop the column `assignedDataCount` on the `IgnoreParameter` table. All the data in the column will be lost.
  - You are about to drop the column `assignedDataCount` on the `IgnoreType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parameterContent]` on the table `IgnoreList` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `IgnoreParameter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `IgnoreType` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IgnoreParameter" DROP COLUMN "assignedDataCount";

-- AlterTable
ALTER TABLE "IgnoreType" DROP COLUMN "assignedDataCount";

-- CreateIndex
CREATE UNIQUE INDEX "IgnoreList_parameterContent_key" ON "IgnoreList"("parameterContent");

-- CreateIndex
CREATE UNIQUE INDEX "IgnoreParameter_name_key" ON "IgnoreParameter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IgnoreType_name_key" ON "IgnoreType"("name");
