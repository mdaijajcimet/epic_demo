-- AlterTable
ALTER TABLE "PLProvider" ADD COLUMN     "australianCreditLicence" INTEGER,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "postSubmissionContent" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "providerId1" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

---------- Copy data from Base Provider to Personal Loan Provider --------
UPDATE "PLProvider"
SET 
    "name" = p."name",
    "slug" = p."slug",
    "providerId1" = p."providerId",
    "logo" = p."logo",
    "postSubmissionContent" = p."postSubmissionContent",
    "australianCreditLicence" = p."australianCreditLicence"
FROM "Provider" p
WHERE "PLProvider"."provider" = p."id";

-- DropForeignKey
ALTER TABLE "PLProvider" DROP CONSTRAINT "PLProvider_provider_fkey";

-- DropIndex
DROP INDEX "PLProvider_provider_idx";

-- AlterTable
ALTER TABLE "PLProvider" DROP COLUMN "provider";

----------Rename Column from providerId1 to providerId --------
ALTER TABLE "PLProvider" RENAME COLUMN "providerId1" TO "providerId";


-- CreateTable
CREATE TABLE "PLFormContainer" (
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

    CONSTRAINT "PLFormContainer_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "_Affiliate_plFormContainer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE TABLE "_PLFormContainer_formComponents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE TABLE "_PLProvider_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE TABLE "_PLFormContainer_provider" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE TABLE "_PLFormContainer_subAffiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE TABLE "_PLFormContainer_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Affiliate_plFormContainer_AB_unique" ON "_Affiliate_plFormContainer"("A", "B");
CREATE INDEX "_Affiliate_plFormContainer_B_index" ON "_Affiliate_plFormContainer"("B");
CREATE UNIQUE INDEX "_PLFormContainer_formComponents_AB_unique" ON "_PLFormContainer_formComponents"("A", "B");
CREATE INDEX "_PLFormContainer_formComponents_B_index" ON "_PLFormContainer_formComponents"("B");
CREATE UNIQUE INDEX "_PLProvider_scripts_AB_unique" ON "_PLProvider_scripts"("A", "B");
CREATE INDEX "_PLProvider_scripts_B_index" ON "_PLProvider_scripts"("B");
CREATE UNIQUE INDEX "_PLFormContainer_provider_AB_unique" ON "_PLFormContainer_provider"("A", "B");
CREATE INDEX "_PLFormContainer_provider_B_index" ON "_PLFormContainer_provider"("B");
CREATE UNIQUE INDEX "_PLFormContainer_subAffiliate_AB_unique" ON "_PLFormContainer_subAffiliate"("A", "B");
CREATE INDEX "_PLFormContainer_subAffiliate_B_index" ON "_PLFormContainer_subAffiliate"("B");
CREATE UNIQUE INDEX "_PLFormContainer_scripts_AB_unique" ON "_PLFormContainer_scripts"("A", "B");
CREATE INDEX "_PLFormContainer_scripts_B_index" ON "_PLFormContainer_scripts"("B");
CREATE UNIQUE INDEX "PLProvider_providerId_key" ON "PLProvider"("providerId");
CREATE UNIQUE INDEX "PLProvider_slug_key" ON "PLProvider"("slug");
CREATE INDEX "PLProvider_logo_idx" ON "PLProvider"("logo");

-- AddForeignKey
ALTER TABLE "PLProvider" ADD CONSTRAINT "PLProvider_logo_fkey" FOREIGN KEY ("logo") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "_Affiliate_plFormContainer" ADD CONSTRAINT "_Affiliate_plFormContainer_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_Affiliate_plFormContainer" ADD CONSTRAINT "_Affiliate_plFormContainer_B_fkey" FOREIGN KEY ("B") REFERENCES "PLFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PLFormContainer_formComponents" ADD CONSTRAINT "_PLFormContainer_formComponents_A_fkey" FOREIGN KEY ("A") REFERENCES "FormComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PLFormContainer_formComponents" ADD CONSTRAINT "_PLFormContainer_formComponents_B_fkey" FOREIGN KEY ("B") REFERENCES "PLFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PLProvider_scripts" ADD CONSTRAINT "_PLProvider_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "PLProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PLProvider_scripts" ADD CONSTRAINT "_PLProvider_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PLFormContainer_provider" ADD CONSTRAINT "_PLFormContainer_provider_A_fkey" FOREIGN KEY ("A") REFERENCES "PLFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PLFormContainer_provider" ADD CONSTRAINT "_PLFormContainer_provider_B_fkey" FOREIGN KEY ("B") REFERENCES "PLProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PLFormContainer_subAffiliate" ADD CONSTRAINT "_PLFormContainer_subAffiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "PLFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PLFormContainer_subAffiliate" ADD CONSTRAINT "_PLFormContainer_subAffiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PLFormContainer_scripts" ADD CONSTRAINT "_PLFormContainer_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "PLFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PLFormContainer_scripts" ADD CONSTRAINT "_PLFormContainer_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

----------------- Personal Loan Form Containers -----------------

BEGIN;

-- 1. Create a temporary table to hold the new PLFormContainer records
CREATE TEMPORARY TABLE TempPLFormContainer AS
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
    v.slug = 'personal-loan'
    AND (fc.page LIKE '/personal-loan/basic-info%' OR EXISTS (
        SELECT 1
        FROM "_FormContainer_provider" fcp
        JOIN "Provider" p ON fcp."B" = p."id"
        JOIN "PLProvider" pcc ON p."providerId" = pcc."providerId"
        WHERE fcp."A" = fc.id
    ));

-- 2. Insert into PLFormContainer using the generated UUIDs
INSERT INTO "PLFormContainer" (id, label, v2, page, "formOrder", "defaultProps", "createdAt", "updatedAt")
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
      TempPLFormContainer;


-- 3. Link formComponents to the new PLFormContainer
INSERT INTO "_PLFormContainer_formComponents" ("A", "B") ---  component -> Container
SELECT
    fcfc."A",
    tcc.newcontainerid
FROM
    TempPLFormContainer tcc
JOIN
    "_FormContainer_formComponents" fcfc ON tcc.oldcontainerid = fcfc."B"; --- Component -> container

-- 4. Link scripts to the neww PLFormContainer
INSERT INTO "_PLFormContainer_scripts" ("A", "B") ---- Container -> script
SELECT
    tcc.newcontainerid,
    sfc."B"
FROM
    TempPLFormContainer tcc
JOIN
    "_FormContainer_scripts" sfc ON tcc.oldcontainerid = sfc."A"; --- Container -> Script

-- 5. Link Affiliate to the new PLFormContainer
INSERT INTO "_Affiliate_plFormContainer" ("A", "B") --- Affiliate -> Container
SELECT
    fca."A",
    tcc.newcontainerid
FROM
    TempPLFormContainer tcc
JOIN
    "_FormContainer_affiliate" fca ON tcc.oldcontainerid = fca."B"; --- Affiliate -> container


-- 6. Link Sub Affiliate to the new PLFormContainer
INSERT INTO "_PLFormContainer_subAffiliate" ("A", "B") ---  Container -> SubAffiliate
SELECT
    tcc.newcontainerid,
    fcs."B"
FROM
    TempPLFormContainer tcc
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
    "PLProvider" pcc ON p."providerId" = pcc."providerId";

-- 8. Link providers to the new PLFormContainer
INSERT INTO "_PLFormContainer_provider" ("A", "B") -- Container -> provider
SELECT
    tcc."newcontainerid",
    tpm."verticalproviderid"
FROM
    TempPLFormContainer tcc
JOIN
    TempProviderMapping tpm ON tcc."oldcontainerid" = tpm.oldcontainerid;

--  9. Clean up the temporary tables
DROP TABLE TempPLFormContainer;
DROP TABLE TempProviderMapping;

COMMIT;
----------------------