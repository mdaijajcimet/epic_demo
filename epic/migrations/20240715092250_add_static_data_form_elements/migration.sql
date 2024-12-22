-- AlterTable
ALTER TABLE "CCFormContainer" ADD COLUMN     "staticData" JSONB;

-- AlterTable
ALTER TABLE "HIFormContainer" ADD COLUMN     "staticData" JSONB;

-- AlterTable
ALTER TABLE "PLFormContainer" ADD COLUMN     "staticData" JSONB;

-- CreateTable
CREATE TABLE "BundleFormContainer" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "v2" BOOLEAN NOT NULL DEFAULT false,
    "hasAllAffiliates" BOOLEAN NOT NULL DEFAULT false,
    "includeAllSubAff" BOOLEAN NOT NULL DEFAULT true,
    "page" TEXT NOT NULL DEFAULT '',
    "formOrder" JSONB DEFAULT '[]',
    "defaultProps" JSONB DEFAULT '{}',
    "staticData" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BundleFormContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Affiliate_bundleFormContainer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BundleFormContainer_subAffiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BundleFormContainer_formComponents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Affiliate_bundleFormContainer_AB_unique" ON "_Affiliate_bundleFormContainer"("A", "B");

-- CreateIndex
CREATE INDEX "_Affiliate_bundleFormContainer_B_index" ON "_Affiliate_bundleFormContainer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BundleFormContainer_subAffiliate_AB_unique" ON "_BundleFormContainer_subAffiliate"("A", "B");

-- CreateIndex
CREATE INDEX "_BundleFormContainer_subAffiliate_B_index" ON "_BundleFormContainer_subAffiliate"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BundleFormContainer_formComponents_AB_unique" ON "_BundleFormContainer_formComponents"("A", "B");

-- CreateIndex
CREATE INDEX "_BundleFormContainer_formComponents_B_index" ON "_BundleFormContainer_formComponents"("B");

-- AddForeignKey
ALTER TABLE "_Affiliate_bundleFormContainer" ADD CONSTRAINT "_Affiliate_bundleFormContainer_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Affiliate_bundleFormContainer" ADD CONSTRAINT "_Affiliate_bundleFormContainer_B_fkey" FOREIGN KEY ("B") REFERENCES "BundleFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleFormContainer_subAffiliate" ADD CONSTRAINT "_BundleFormContainer_subAffiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "BundleFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleFormContainer_subAffiliate" ADD CONSTRAINT "_BundleFormContainer_subAffiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleFormContainer_formComponents" ADD CONSTRAINT "_BundleFormContainer_formComponents_A_fkey" FOREIGN KEY ("A") REFERENCES "BundleFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleFormContainer_formComponents" ADD CONSTRAINT "_BundleFormContainer_formComponents_B_fkey" FOREIGN KEY ("B") REFERENCES "FormComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
