/*
  Warnings:

  - A unique constraint covering the columns `[hostname]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "domainConfig" TEXT;

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "key" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "DomainConfig" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "metaTitle" TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "favicon" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '',
    "secondaryColor" TEXT NOT NULL DEFAULT '',
    "accentColor" TEXT NOT NULL DEFAULT '',
    "fontUrl" TEXT NOT NULL DEFAULT '',
    "fontFamily" TEXT NOT NULL DEFAULT '',
    "headerLogo" TEXT,
    "headerLinkGroupsOrder" JSONB DEFAULT '[]',
    "enableBlogs" BOOLEAN NOT NULL DEFAULT false,
    "footerLogo" TEXT,
    "footerLinkGroupsOrder" JSONB DEFAULT '[]',
    "address" TEXT NOT NULL DEFAULT '',
    "disclaimer" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DomainConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkGroup" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "key" TEXT NOT NULL DEFAULT '',
    "linksOrder" JSONB DEFAULT '[]',

    CONSTRAINT "LinkGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LinkGroup_links" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DomainConfig_headerLinkGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DomainConfig_footerLinkGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DomainConfig_socialIcons" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "DomainConfig_favicon_idx" ON "DomainConfig"("favicon");

-- CreateIndex
CREATE INDEX "DomainConfig_headerLogo_idx" ON "DomainConfig"("headerLogo");

-- CreateIndex
CREATE INDEX "DomainConfig_footerLogo_idx" ON "DomainConfig"("footerLogo");

-- CreateIndex
CREATE UNIQUE INDEX "_LinkGroup_links_AB_unique" ON "_LinkGroup_links"("A", "B");

-- CreateIndex
CREATE INDEX "_LinkGroup_links_B_index" ON "_LinkGroup_links"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DomainConfig_headerLinkGroups_AB_unique" ON "_DomainConfig_headerLinkGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_DomainConfig_headerLinkGroups_B_index" ON "_DomainConfig_headerLinkGroups"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DomainConfig_footerLinkGroups_AB_unique" ON "_DomainConfig_footerLinkGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_DomainConfig_footerLinkGroups_B_index" ON "_DomainConfig_footerLinkGroups"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DomainConfig_socialIcons_AB_unique" ON "_DomainConfig_socialIcons"("A", "B");

-- CreateIndex
CREATE INDEX "_DomainConfig_socialIcons_B_index" ON "_DomainConfig_socialIcons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_hostname_key" ON "Domain"("hostname");

-- CreateIndex
CREATE INDEX "Domain_domainConfig_idx" ON "Domain"("domainConfig");

-- CreateIndex
CREATE INDEX "Link_icon_idx" ON "Link"("icon");

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_domainConfig_fkey" FOREIGN KEY ("domainConfig") REFERENCES "DomainConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_icon_fkey" FOREIGN KEY ("icon") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainConfig" ADD CONSTRAINT "DomainConfig_favicon_fkey" FOREIGN KEY ("favicon") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainConfig" ADD CONSTRAINT "DomainConfig_headerLogo_fkey" FOREIGN KEY ("headerLogo") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainConfig" ADD CONSTRAINT "DomainConfig_footerLogo_fkey" FOREIGN KEY ("footerLogo") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkGroup_links" ADD CONSTRAINT "_LinkGroup_links_A_fkey" FOREIGN KEY ("A") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkGroup_links" ADD CONSTRAINT "_LinkGroup_links_B_fkey" FOREIGN KEY ("B") REFERENCES "LinkGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainConfig_headerLinkGroups" ADD CONSTRAINT "_DomainConfig_headerLinkGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "DomainConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainConfig_headerLinkGroups" ADD CONSTRAINT "_DomainConfig_headerLinkGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "LinkGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainConfig_footerLinkGroups" ADD CONSTRAINT "_DomainConfig_footerLinkGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "DomainConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainConfig_footerLinkGroups" ADD CONSTRAINT "_DomainConfig_footerLinkGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "LinkGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainConfig_socialIcons" ADD CONSTRAINT "_DomainConfig_socialIcons_A_fkey" FOREIGN KEY ("A") REFERENCES "DomainConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainConfig_socialIcons" ADD CONSTRAINT "_DomainConfig_socialIcons_B_fkey" FOREIGN KEY ("B") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
