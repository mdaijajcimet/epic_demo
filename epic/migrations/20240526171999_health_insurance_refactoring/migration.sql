-- AlterTable
ALTER TABLE "HIProvider" ADD COLUMN     "australianCreditLicence" INTEGER,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "postSubmissionContent" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "providerId1" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

---------- Copy data from Base Provider to Health Insurance Provider --------
UPDATE "HIProvider"
SET 
    "name" = p."name",
    "slug" = p."slug",
    "providerId1" = p."providerId",
    "logo" = p."logo",
    "postSubmissionContent" = p."postSubmissionContent",
    "australianCreditLicence" = p."australianCreditLicence"
FROM "Provider" p
WHERE "HIProvider"."provider" = p."id";

-- DropForeignKey
ALTER TABLE "HIProvider" DROP CONSTRAINT "HIProvider_provider_fkey";

-- DropIndex
DROP INDEX "HIProvider_provider_idx";

-- AlterTable
ALTER TABLE "HIProvider" DROP COLUMN "provider";

----------Rename Column from providerId1 to providerId --------
ALTER TABLE "HIProvider" RENAME COLUMN "providerId1" TO "providerId";


-- CreateTable
CREATE TABLE "HIFormContainer" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "v2" BOOLEAN NOT NULL DEFAULT false,
    "hasAllAffiliates" BOOLEAN NOT NULL DEFAULT false,
    "includeAllSubAff" BOOLEAN NOT NULL DEFAULT true,
    "page" TEXT NOT NULL DEFAULT '',
    "formOrder" JSONB DEFAULT '[]',
    "defaultProps" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HIFormContainer_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "_Affiliate_hiFormContainer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE TABLE "_HIFormContainer_formComponents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE TABLE "_HIProvider_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE TABLE "_HIFormContainer_provider" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE TABLE "_HIFormContainer_subAffiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE TABLE "_HIFormContainer_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Affiliate_hiFormContainer_AB_unique" ON "_Affiliate_hiFormContainer"("A", "B");
CREATE INDEX "_Affiliate_hiFormContainer_B_index" ON "_Affiliate_hiFormContainer"("B");
CREATE UNIQUE INDEX "_HIFormContainer_formComponents_AB_unique" ON "_HIFormContainer_formComponents"("A", "B");
CREATE INDEX "_HIFormContainer_formComponents_B_index" ON "_HIFormContainer_formComponents"("B");
CREATE UNIQUE INDEX "_HIProvider_scripts_AB_unique" ON "_HIProvider_scripts"("A", "B");
CREATE INDEX "_HIProvider_scripts_B_index" ON "_HIProvider_scripts"("B");
CREATE UNIQUE INDEX "_HIFormContainer_provider_AB_unique" ON "_HIFormContainer_provider"("A", "B");
CREATE INDEX "_HIFormContainer_provider_B_index" ON "_HIFormContainer_provider"("B");
CREATE UNIQUE INDEX "_HIFormContainer_subAffiliate_AB_unique" ON "_HIFormContainer_subAffiliate"("A", "B");
CREATE INDEX "_HIFormContainer_subAffiliate_B_index" ON "_HIFormContainer_subAffiliate"("B");
CREATE UNIQUE INDEX "_HIFormContainer_scripts_AB_unique" ON "_HIFormContainer_scripts"("A", "B");
CREATE INDEX "_HIFormContainer_scripts_B_index" ON "_HIFormContainer_scripts"("B");
CREATE UNIQUE INDEX "HIProvider_providerId_key" ON "HIProvider"("providerId");
CREATE UNIQUE INDEX "HIProvider_slug_key" ON "HIProvider"("slug");
CREATE INDEX "HIProvider_logo_idx" ON "HIProvider"("logo");

-- AddForeignKey
ALTER TABLE "HIProvider" ADD CONSTRAINT "HIProvider_logo_fkey" FOREIGN KEY ("logo") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "_Affiliate_hiFormContainer" ADD CONSTRAINT "_Affiliate_hiFormContainer_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_Affiliate_hiFormContainer" ADD CONSTRAINT "_Affiliate_hiFormContainer_B_fkey" FOREIGN KEY ("B") REFERENCES "HIFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HIFormContainer_formComponents" ADD CONSTRAINT "_HIFormContainer_formComponents_A_fkey" FOREIGN KEY ("A") REFERENCES "FormComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HIFormContainer_formComponents" ADD CONSTRAINT "_HIFormContainer_formComponents_B_fkey" FOREIGN KEY ("B") REFERENCES "HIFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HIProvider_scripts" ADD CONSTRAINT "_HIProvider_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "HIProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HIProvider_scripts" ADD CONSTRAINT "_HIProvider_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HIFormContainer_provider" ADD CONSTRAINT "_HIFormContainer_provider_A_fkey" FOREIGN KEY ("A") REFERENCES "HIFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HIFormContainer_provider" ADD CONSTRAINT "_HIFormContainer_provider_B_fkey" FOREIGN KEY ("B") REFERENCES "HIProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HIFormContainer_subAffiliate" ADD CONSTRAINT "_HIFormContainer_subAffiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "HIFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HIFormContainer_subAffiliate" ADD CONSTRAINT "_HIFormContainer_subAffiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HIFormContainer_scripts" ADD CONSTRAINT "_HIFormContainer_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "HIFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HIFormContainer_scripts" ADD CONSTRAINT "_HIFormContainer_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

----------------- Health Insurance Form Containers -----------------

BEGIN;

-- 1. Create a temporary table to hold the new HIFormContainer records
CREATE TEMPORARY TABLE TempHIFormContainer AS
SELECT DISTINCT
    fc.id AS oldcontainerid,
    fc.id AS newcontainerid,
    CONCAT_WS(' - ', fc.page, 'Default') AS label,
    fc.v2,
    fc.page,
    fc."formOrder",
    fc."defaultProps"
FROM
    "FormContainer" fc
JOIN
    "Vertical" v ON fc."vertical" = v.id
WHERE
    v.slug = 'health-insurance'
    AND (fc.page LIKE '/health-insurance%' OR EXISTS (
        SELECT 1
        FROM "_FormContainer_provider" fcp
        JOIN "Provider" p ON fcp."B" = p."id"
        JOIN "HIProvider" pcc ON p."providerId" = pcc."providerId"
        WHERE fcp."A" = fc.id
    ));

-- 2. Insert into HIFormContainer using the generated UUIDs
INSERT INTO "HIFormContainer" (id, label, v2, page, "formOrder", "defaultProps", "createdAt", "updatedAt")
  SELECT DISTINCT
  	newcontainerid,
    label,
    v2,
  	page,
  	"formOrder",
  	"defaultProps",
	NOW(),
    NOW()
  FROM
      TempHIFormContainer;


-- 3. Link formComponents to the new HIFormContainer
INSERT INTO "_HIFormContainer_formComponents" ("A", "B") ---  component -> Container
SELECT
    fcfc."A",
    tcc.newcontainerid
FROM
    TempHIFormContainer tcc
JOIN
    "_FormContainer_formComponents" fcfc ON tcc.oldcontainerid = fcfc."B"; --- Component -> container

-- 4. Link scripts to the neww HIFormContainer
INSERT INTO "_HIFormContainer_scripts" ("A", "B") ---- Container -> script
SELECT
    tcc.newcontainerid,
    sfc."B"
FROM
    TempHIFormContainer tcc
JOIN
    "_FormContainer_scripts" sfc ON tcc.oldcontainerid = sfc."A"; --- Container -> Script

-- 5. Link Affiliate to the new HIFormContainer
INSERT INTO "_Affiliate_hiFormContainer" ("A", "B") --- Affiliate -> Container
SELECT
    fca."A",
    tcc.newcontainerid
FROM
    TempHIFormContainer tcc
JOIN
    "_FormContainer_affiliate" fca ON tcc.oldcontainerid = fca."B"; --- Affiliate -> container


-- 6. Link Sub Affiliate to the new HIFormContainer
INSERT INTO "_HIFormContainer_subAffiliate" ("A", "B") ---  Container -> SubAffiliate
SELECT
    tcc.newcontainerid,
    fcs."B"
FROM
    TempHIFormContainer tcc
JOIN
    "_FormContainer_subAffiliate" fcs ON tcc.oldcontainerid = fcs."A"; --- container -> Subaffiliate
    

-- 7. Create a temporary table for Provider mapping
CREATE TEMPORARY TABLE TempProviderMapping AS
SELECT DISTINCT
    fcp."A" AS oldcontainerid,
    pcc.id AS verticalproviderid
FROM
    "_FormContainer_provider" fcp
JOIN
    "Provider" p ON fcp."B" = p.id
JOIN
    "HIProvider" pcc ON p."providerId" = pcc."providerId";

-- 8. Link providers to the new HIFormContainer
INSERT INTO "_HIFormContainer_provider" ("A", "B") -- Container -> provider
SELECT
    tcc."newcontainerid",
    tpm."verticalproviderid"
FROM
    TempHIFormContainer tcc
JOIN
    TempProviderMapping tpm ON tcc."oldcontainerid" = tpm.oldcontainerid;

--  9. Clean up the temporary tables
DROP TABLE TempHIFormContainer;
DROP TABLE TempProviderMapping;

COMMIT;
----------------------