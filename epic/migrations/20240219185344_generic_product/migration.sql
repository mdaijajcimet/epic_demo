-- CreateTable
CREATE TABLE "GenericProvider" (
    "id" TEXT NOT NULL,
    "providerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "businessName" TEXT NOT NULL DEFAULT '',
    "legalName" TEXT NOT NULL DEFAULT '',
    "includeAllSubAff" BOOLEAN NOT NULL DEFAULT true,
    "country" TEXT,
    "vertical" TEXT,
    "termsCondition" TEXT NOT NULL DEFAULT '',
    "postSubmissionContent" TEXT NOT NULL DEFAULT '',
    "csStatus" BOOLEAN NOT NULL DEFAULT true,
    "agentStatus" BOOLEAN NOT NULL DEFAULT true,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "customConfig" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenericProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenericPlan" (
    "id" TEXT NOT NULL,
    "planId" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "termsCondition" TEXT,
    "specialOffer" TEXT,
    "preferenceOrder" INTEGER,
    "viewDetails" TEXT,
    "provider" TEXT,
    "includeAllSubAff" BOOLEAN NOT NULL DEFAULT true,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "csStatus" BOOLEAN NOT NULL DEFAULT true,
    "agentStatus" BOOLEAN NOT NULL DEFAULT true,
    "viewStatus" BOOLEAN NOT NULL DEFAULT true,
    "agentSendStatus" BOOLEAN NOT NULL DEFAULT true,
    "customConfig" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenericPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenericPlanField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "label" TEXT NOT NULL DEFAULT '',
    "key" TEXT NOT NULL DEFAULT '',
    "type" TEXT,
    "value" TEXT NOT NULL DEFAULT '',
    "formatter" TEXT,
    "suffix" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "hasListing" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenericPlanField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenericAddon" (
    "id" TEXT NOT NULL,
    "addonId" INTEGER,
    "addonName" TEXT NOT NULL DEFAULT '',
    "price" TEXT NOT NULL DEFAULT '',
    "provider" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenericAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckBoxContent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "type" TEXT DEFAULT 'required',
    "order" INTEGER,
    "content" TEXT NOT NULL DEFAULT '',
    "validationMessage" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckBoxContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "key" TEXT,
    "media" TEXT,

    CONSTRAINT "Logo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GenericProvider_affiliates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericProvider_disallowAff" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericPlan_affiliates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericPlan_disallowAff" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericProvider_subAffiliates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericProvider_disallowSubaff" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericProvider_logos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericProvider_qaEmails" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericPlan_benefits" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericPlan_features" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericPlan_parameters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericPlan_attachments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericPlan_subAffiliates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericPlan_disallowSubaff" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericAddon_plans" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenericPlan_consents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GenericProvider_providerId_key" ON "GenericProvider"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "GenericProvider_slug_key" ON "GenericProvider"("slug");

-- CreateIndex
CREATE INDEX "GenericProvider_vertical_idx" ON "GenericProvider"("vertical");

-- CreateIndex
CREATE UNIQUE INDEX "GenericPlan_planId_key" ON "GenericPlan"("planId");

-- CreateIndex
CREATE INDEX "GenericPlan_description_idx" ON "GenericPlan"("description");

-- CreateIndex
CREATE INDEX "GenericPlan_termsCondition_idx" ON "GenericPlan"("termsCondition");

-- CreateIndex
CREATE INDEX "GenericPlan_specialOffer_idx" ON "GenericPlan"("specialOffer");

-- CreateIndex
CREATE INDEX "GenericPlan_viewDetails_idx" ON "GenericPlan"("viewDetails");

-- CreateIndex
CREATE INDEX "GenericPlan_provider_idx" ON "GenericPlan"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "GenericAddon_addonId_key" ON "GenericAddon"("addonId");

-- CreateIndex
CREATE INDEX "GenericAddon_provider_idx" ON "GenericAddon"("provider");

-- CreateIndex
CREATE INDEX "Logo_media_idx" ON "Logo"("media");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericProvider_affiliates_AB_unique" ON "_GenericProvider_affiliates"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericProvider_affiliates_B_index" ON "_GenericProvider_affiliates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericProvider_disallowAff_AB_unique" ON "_GenericProvider_disallowAff"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericProvider_disallowAff_B_index" ON "_GenericProvider_disallowAff"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericPlan_affiliates_AB_unique" ON "_GenericPlan_affiliates"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericPlan_affiliates_B_index" ON "_GenericPlan_affiliates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericPlan_disallowAff_AB_unique" ON "_GenericPlan_disallowAff"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericPlan_disallowAff_B_index" ON "_GenericPlan_disallowAff"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericProvider_subAffiliates_AB_unique" ON "_GenericProvider_subAffiliates"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericProvider_subAffiliates_B_index" ON "_GenericProvider_subAffiliates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericProvider_disallowSubaff_AB_unique" ON "_GenericProvider_disallowSubaff"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericProvider_disallowSubaff_B_index" ON "_GenericProvider_disallowSubaff"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericProvider_logos_AB_unique" ON "_GenericProvider_logos"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericProvider_logos_B_index" ON "_GenericProvider_logos"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericProvider_qaEmails_AB_unique" ON "_GenericProvider_qaEmails"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericProvider_qaEmails_B_index" ON "_GenericProvider_qaEmails"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericPlan_benefits_AB_unique" ON "_GenericPlan_benefits"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericPlan_benefits_B_index" ON "_GenericPlan_benefits"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericPlan_features_AB_unique" ON "_GenericPlan_features"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericPlan_features_B_index" ON "_GenericPlan_features"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericPlan_parameters_AB_unique" ON "_GenericPlan_parameters"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericPlan_parameters_B_index" ON "_GenericPlan_parameters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericPlan_attachments_AB_unique" ON "_GenericPlan_attachments"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericPlan_attachments_B_index" ON "_GenericPlan_attachments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericPlan_subAffiliates_AB_unique" ON "_GenericPlan_subAffiliates"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericPlan_subAffiliates_B_index" ON "_GenericPlan_subAffiliates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericPlan_disallowSubaff_AB_unique" ON "_GenericPlan_disallowSubaff"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericPlan_disallowSubaff_B_index" ON "_GenericPlan_disallowSubaff"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericAddon_plans_AB_unique" ON "_GenericAddon_plans"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericAddon_plans_B_index" ON "_GenericAddon_plans"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenericPlan_consents_AB_unique" ON "_GenericPlan_consents"("A", "B");

-- CreateIndex
CREATE INDEX "_GenericPlan_consents_B_index" ON "_GenericPlan_consents"("B");

-- AddForeignKey
ALTER TABLE "GenericProvider" ADD CONSTRAINT "GenericProvider_vertical_fkey" FOREIGN KEY ("vertical") REFERENCES "Vertical"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenericPlan" ADD CONSTRAINT "GenericPlan_description_fkey" FOREIGN KEY ("description") REFERENCES "GenericPlanField"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenericPlan" ADD CONSTRAINT "GenericPlan_termsCondition_fkey" FOREIGN KEY ("termsCondition") REFERENCES "GenericPlanField"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenericPlan" ADD CONSTRAINT "GenericPlan_specialOffer_fkey" FOREIGN KEY ("specialOffer") REFERENCES "GenericPlanField"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenericPlan" ADD CONSTRAINT "GenericPlan_viewDetails_fkey" FOREIGN KEY ("viewDetails") REFERENCES "GenericPlanField"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenericPlan" ADD CONSTRAINT "GenericPlan_provider_fkey" FOREIGN KEY ("provider") REFERENCES "GenericProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenericAddon" ADD CONSTRAINT "GenericAddon_provider_fkey" FOREIGN KEY ("provider") REFERENCES "GenericProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logo" ADD CONSTRAINT "Logo_media_fkey" FOREIGN KEY ("media") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_affiliates" ADD CONSTRAINT "_GenericProvider_affiliates_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_affiliates" ADD CONSTRAINT "_GenericProvider_affiliates_B_fkey" FOREIGN KEY ("B") REFERENCES "GenericProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_disallowAff" ADD CONSTRAINT "_GenericProvider_disallowAff_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_disallowAff" ADD CONSTRAINT "_GenericProvider_disallowAff_B_fkey" FOREIGN KEY ("B") REFERENCES "GenericProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_affiliates" ADD CONSTRAINT "_GenericPlan_affiliates_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_affiliates" ADD CONSTRAINT "_GenericPlan_affiliates_B_fkey" FOREIGN KEY ("B") REFERENCES "GenericPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_disallowAff" ADD CONSTRAINT "_GenericPlan_disallowAff_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_disallowAff" ADD CONSTRAINT "_GenericPlan_disallowAff_B_fkey" FOREIGN KEY ("B") REFERENCES "GenericPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_subAffiliates" ADD CONSTRAINT "_GenericProvider_subAffiliates_A_fkey" FOREIGN KEY ("A") REFERENCES "GenericProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_subAffiliates" ADD CONSTRAINT "_GenericProvider_subAffiliates_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_disallowSubaff" ADD CONSTRAINT "_GenericProvider_disallowSubaff_A_fkey" FOREIGN KEY ("A") REFERENCES "GenericProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_disallowSubaff" ADD CONSTRAINT "_GenericProvider_disallowSubaff_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_logos" ADD CONSTRAINT "_GenericProvider_logos_A_fkey" FOREIGN KEY ("A") REFERENCES "GenericProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_logos" ADD CONSTRAINT "_GenericProvider_logos_B_fkey" FOREIGN KEY ("B") REFERENCES "Logo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_qaEmails" ADD CONSTRAINT "_GenericProvider_qaEmails_A_fkey" FOREIGN KEY ("A") REFERENCES "GenericProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericProvider_qaEmails" ADD CONSTRAINT "_GenericProvider_qaEmails_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_benefits" ADD CONSTRAINT "_GenericPlan_benefits_A_fkey" FOREIGN KEY ("A") REFERENCES "GenericPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_benefits" ADD CONSTRAINT "_GenericPlan_benefits_B_fkey" FOREIGN KEY ("B") REFERENCES "GenericPlanField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_features" ADD CONSTRAINT "_GenericPlan_features_A_fkey" FOREIGN KEY ("A") REFERENCES "GenericPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_features" ADD CONSTRAINT "_GenericPlan_features_B_fkey" FOREIGN KEY ("B") REFERENCES "GenericPlanField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_parameters" ADD CONSTRAINT "_GenericPlan_parameters_A_fkey" FOREIGN KEY ("A") REFERENCES "GenericPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_parameters" ADD CONSTRAINT "_GenericPlan_parameters_B_fkey" FOREIGN KEY ("B") REFERENCES "GenericPlanField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_attachments" ADD CONSTRAINT "_GenericPlan_attachments_A_fkey" FOREIGN KEY ("A") REFERENCES "GenericPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_attachments" ADD CONSTRAINT "_GenericPlan_attachments_B_fkey" FOREIGN KEY ("B") REFERENCES "GenericPlanField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_subAffiliates" ADD CONSTRAINT "_GenericPlan_subAffiliates_A_fkey" FOREIGN KEY ("A") REFERENCES "GenericPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_subAffiliates" ADD CONSTRAINT "_GenericPlan_subAffiliates_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_disallowSubaff" ADD CONSTRAINT "_GenericPlan_disallowSubaff_A_fkey" FOREIGN KEY ("A") REFERENCES "GenericPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_disallowSubaff" ADD CONSTRAINT "_GenericPlan_disallowSubaff_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericAddon_plans" ADD CONSTRAINT "_GenericAddon_plans_A_fkey" FOREIGN KEY ("A") REFERENCES "GenericAddon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericAddon_plans" ADD CONSTRAINT "_GenericAddon_plans_B_fkey" FOREIGN KEY ("B") REFERENCES "GenericPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_consents" ADD CONSTRAINT "_GenericPlan_consents_A_fkey" FOREIGN KEY ("A") REFERENCES "CheckBoxContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenericPlan_consents" ADD CONSTRAINT "_GenericPlan_consents_B_fkey" FOREIGN KEY ("B") REFERENCES "GenericPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
