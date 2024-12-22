------------------ CREDITCARD ----------------------

-- AlterTable
ALTER TABLE "ProviderCreditCard" ADD COLUMN     "australianCreditLicence" INTEGER,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "postSubmissionContent" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "providerId1" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "_ProviderCreditCard_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProviderCreditCard_scripts_AB_unique" ON "_ProviderCreditCard_scripts"("A", "B");
CREATE INDEX "_ProviderCreditCard_scripts_B_index" ON "_ProviderCreditCard_scripts"("B");
CREATE INDEX "ProviderCreditCard_logo_idx" ON "ProviderCreditCard"("logo");

-- AddForeignKey
ALTER TABLE "ProviderCreditCard" ADD CONSTRAINT "ProviderCreditCard_logo_fkey" FOREIGN KEY ("logo") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "_ProviderCreditCard_scripts" ADD CONSTRAINT "_ProviderCreditCard_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "ProviderCreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ProviderCreditCard_scripts" ADD CONSTRAINT "_ProviderCreditCard_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

---------- Copy data from Base Provider to CreditCard Provider --------
UPDATE "ProviderCreditCard"
SET 
    "name" = p."name",
    "slug" = p."slug",
    "providerId1" = p."providerId",
    "logo" = p."logo",
    "postSubmissionContent" = p."postSubmissionContent",
    "australianCreditLicence" = p."australianCreditLicence"
FROM "Provider" p
WHERE "ProviderCreditCard"."provider" = p."id";

-- DropForeignKey
ALTER TABLE "ProviderCreditCard" DROP CONSTRAINT "ProviderCreditCard_provider_fkey";

-- DropIndex
DROP INDEX "ProviderCreditCard_provider_idx";

-- AlterTable
ALTER TABLE "ProviderCreditCard" DROP COLUMN "provider";

----------Rename Column from providerId1 to providerId --------
ALTER TABLE "ProviderCreditCard" RENAME COLUMN "providerId1" TO "providerId";

-- CreateIndex
CREATE UNIQUE INDEX "ProviderCreditCard_providerId_key" ON "ProviderCreditCard"("providerId");
CREATE UNIQUE INDEX "ProviderCreditCard_slug_key" ON "ProviderCreditCard"("slug");

-- CreateTable
CREATE TABLE "CCFormContainer" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "v2" BOOLEAN NOT NULL DEFAULT false,
    "page" TEXT NOT NULL DEFAULT '',
    "formOrder" JSONB DEFAULT '[]',
    "defaultProps" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CCFormContainer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_CCFormContainer_provider" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE TABLE "_CCFormContainer_formComponents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE TABLE "_CCFormContainer_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CCFormContainer_provider_AB_unique" ON "_CCFormContainer_provider"("A", "B");
CREATE INDEX "_CCFormContainer_provider_B_index" ON "_CCFormContainer_provider"("B");
CREATE UNIQUE INDEX "_CCFormContainer_formComponents_AB_unique" ON "_CCFormContainer_formComponents"("A", "B");
CREATE INDEX "_CCFormContainer_formComponents_B_index" ON "_CCFormContainer_formComponents"("B");
CREATE UNIQUE INDEX "_CCFormContainer_scripts_AB_unique" ON "_CCFormContainer_scripts"("A", "B");
CREATE INDEX "_CCFormContainer_scripts_B_index" ON "_CCFormContainer_scripts"("B");

-- AddForeignKey
ALTER TABLE "_CCFormContainer_provider" ADD CONSTRAINT "_CCFormContainer_provider_A_fkey" FOREIGN KEY ("A") REFERENCES "CCFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCFormContainer_provider" ADD CONSTRAINT "_CCFormContainer_provider_B_fkey" FOREIGN KEY ("B") REFERENCES "ProviderCreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCFormContainer_formComponents" ADD CONSTRAINT "_CCFormContainer_formComponents_A_fkey" FOREIGN KEY ("A") REFERENCES "CCFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCFormContainer_formComponents" ADD CONSTRAINT "_CCFormContainer_formComponents_B_fkey" FOREIGN KEY ("B") REFERENCES "FormComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCFormContainer_scripts" ADD CONSTRAINT "_CCFormContainer_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "CCFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCFormContainer_scripts" ADD CONSTRAINT "_CCFormContainer_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "CCFormContainer" ADD COLUMN     "hasAllAffiliates" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeAllSubAff" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "_Affiliate_ccFormContainer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE TABLE "_CCFormContainer_subAffiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Affiliate_ccFormContainer_AB_unique" ON "_Affiliate_ccFormContainer"("A", "B");
CREATE INDEX "_Affiliate_ccFormContainer_B_index" ON "_Affiliate_ccFormContainer"("B");
CREATE UNIQUE INDEX "_CCFormContainer_subAffiliate_AB_unique" ON "_CCFormContainer_subAffiliate"("A", "B");
CREATE INDEX "_CCFormContainer_subAffiliate_B_index" ON "_CCFormContainer_subAffiliate"("B");

-- AddForeignKey
ALTER TABLE "_Affiliate_ccFormContainer" ADD CONSTRAINT "_Affiliate_ccFormContainer_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_Affiliate_ccFormContainer" ADD CONSTRAINT "_Affiliate_ccFormContainer_B_fkey" FOREIGN KEY ("B") REFERENCES "CCFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCFormContainer_subAffiliate" ADD CONSTRAINT "_CCFormContainer_subAffiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "CCFormContainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCFormContainer_subAffiliate" ADD CONSTRAINT "_CCFormContainer_subAffiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

----------------- CreditCard Form Containers -----------------

BEGIN;

-- 1. Create a temporary table to hold the new CCFormContainer records with generated UUIDs
CREATE TEMPORARY TABLE TempCCFormContainer AS
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
    v.slug = 'credit-cards'
    AND (fc.page = '/credit-cards/basic-info' OR EXISTS (
        SELECT 1
        FROM "_FormContainer_provider" fcp
        JOIN "Provider" p ON fcp."B" = p."id"
        JOIN "ProviderCreditCard" pcc ON p."providerId" = pcc."providerId"
        WHERE fcp."A" = fc.id
    ));

-- 2. Insert into CCFormContainer using the generated UUIDs
INSERT INTO "CCFormContainer" (id, label, v2, page, "formOrder", "defaultProps", "createdAt", "updatedAt")
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
      TempCCFormContainer;


-- 3. Link formComponents to the new CCFormContainer
INSERT INTO "_CCFormContainer_formComponents" ("A", "B") --- Container -> component
SELECT
    tcc.newcontainerid,
    fcfc."A"
FROM
    TempCCFormContainer tcc
JOIN
    "_FormContainer_formComponents" fcfc ON tcc.oldcontainerid = fcfc."B"; --- Component -> container

-- 4. Link scripts to the new CCFormContainer
INSERT INTO "_CCFormContainer_scripts" ("A", "B") ---- Container -> script
SELECT
    tcc.newcontainerid,
    sfc."B"
FROM
    TempCCFormContainer tcc
JOIN
    "_FormContainer_scripts" sfc ON tcc.oldcontainerid = sfc."A"; --- Container -> Script

-- 5. Link Affiliate to the new CCFormContainer
INSERT INTO "_Affiliate_ccFormContainer" ("A", "B") --- Affiliate -> Container
SELECT
    fca."A",
    tcc.newcontainerid
FROM
    TempCCFormContainer tcc
JOIN
    "_FormContainer_affiliate" fca ON tcc.oldcontainerid = fca."B"; --- Affiliate -> container


-- 6. Link Sub Affiliate to the new CCFormContainer
INSERT INTO "_CCFormContainer_subAffiliate" ("A", "B") ---  Container -> SubAffiliate
SELECT
    tcc.newcontainerid,
    fcs."B"
FROM
    TempCCFormContainer tcc
JOIN
    "_FormContainer_subAffiliate" fcs ON tcc.oldcontainerid = fcs."A"; --- container -> Subaffiliate
    

-- 7. Create a temporary table for Provider mapping
CREATE TEMPORARY TABLE TempProviderMapping AS
SELECT DISTINCT
    fcp."A" AS oldcontainerid,
    pcc.id AS providercreditcardid
FROM
    "_FormContainer_provider" fcp
JOIN
    "Provider" p ON fcp."B" = p.id
JOIN
    "ProviderCreditCard" pcc ON p."providerId" = pcc."providerId";

-- 8. Link providers to the new CCFormContainer
INSERT INTO "_CCFormContainer_provider" ("A", "B") -- Container -> provider
SELECT
    tcc."newcontainerid",
    tpm."providercreditcardid"
FROM
    TempCCFormContainer tcc
JOIN
    TempProviderMapping tpm ON tcc."oldcontainerid" = tpm.oldcontainerid;

--  9. Clean up the temporary tables
DROP TABLE TempCCFormContainer;
DROP TABLE TempProviderMapping;

COMMIT;
----------------------