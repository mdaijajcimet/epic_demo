/*
  Warnings:

  - A unique constraint covering the columns `[pageConfig]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "pageConfig" TEXT;

-- CreateTable
CREATE TABLE "PageConfig" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "favicon" TEXT,
    "headerLogo" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '',
    "secondaryColor" TEXT NOT NULL DEFAULT '',
    "accentColor" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "PageConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageConfig_favicon_idx" ON "PageConfig"("favicon");

-- CreateIndex
CREATE INDEX "PageConfig_headerLogo_idx" ON "PageConfig"("headerLogo");

-- CreateIndex
CREATE UNIQUE INDEX "Page_pageConfig_key" ON "Page"("pageConfig");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_pageConfig_fkey" FOREIGN KEY ("pageConfig") REFERENCES "PageConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageConfig" ADD CONSTRAINT "PageConfig_favicon_fkey" FOREIGN KEY ("favicon") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageConfig" ADD CONSTRAINT "PageConfig_headerLogo_fkey" FOREIGN KEY ("headerLogo") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
