-- CreateEnum
CREATE TYPE "CsSiteSlugType" AS ENUM ('econnex', 'iselect');

-- CreateEnum
CREATE TYPE "ScriptCategoryType" AS ENUM ('mandatory', 'agent_response', 'optional');

-- CreateEnum
CREATE TYPE "ScriptConnectionTypeType" AS ENUM ('nbn', 'adsl', 'cable', 'four_g', 'five_g', 'opti', 'lbn', 'mobile');

-- CreateEnum
CREATE TYPE "ScriptTechnologyTypeType" AS ENUM ('fttb', 'fttp', 'fttn', 'fttc', 'hfc', 'satellite', 'wireless');

-- CreateEnum
CREATE TYPE "ScriptPositionType" AS ENUM ('top_left', 'top_center', 'top_right', 'bottom_left', 'bottom_right', 'bottom_center', 'center_left', 'centered', 'center_right');

-- CreateEnum
CREATE TYPE "CreditCardCardNetworkType" AS ENUM ('visa', 'mastercard', 'amex', 'diners_club', 'visa_amex', 'mastercard_amex');

-- CreateEnum
CREATE TYPE "CreditCardCardTypeType" AS ENUM ('standard', 'gold', 'platinum', 'premium');

-- CreateEnum
CREATE TYPE "EarnRateRangeUnitType" AS ENUM ('points', 'dollars');

-- CreateEnum
CREATE TYPE "EarnRateRangePeriodType" AS ENUM ('monthly', 'annually');

-- CreateEnum
CREATE TYPE "InstallerContactTypeType" AS ENUM ('telephone', 'mobile');

-- CreateTable
CREATE TABLE "Addon" (
    "id" TEXT NOT NULL,
    "addonGroup" TEXT,
    "addonId" INTEGER,
    "addonName" TEXT NOT NULL DEFAULT '',
    "category" INTEGER,
    "price" TEXT NOT NULL DEFAULT '',
    "isMandatory" INTEGER,
    "include" INTEGER,

    CONSTRAINT "Addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Affiliate" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "apiKey" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Affiliate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CsSite" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL DEFAULT '',
    "slug" "CsSiteSlugType",
    "apiKey" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CsSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "altText" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "doc_filesize" INTEGER,
    "doc_filename" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "type" TEXT,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL,
    "status" TEXT DEFAULT 'draft',
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "thumbnail" TEXT,
    "heroImage" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "subHead" TEXT NOT NULL DEFAULT '',
    "supportingText" TEXT NOT NULL DEFAULT '',
    "linkLabel" TEXT NOT NULL DEFAULT '',
    "linkUrl" TEXT NOT NULL DEFAULT '',
    "publishDate" TIMESTAMP(3),
    "author" TEXT,
    "vertical" TEXT,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "planId" INTEGER,
    "name" TEXT NOT NULL DEFAULT '',
    "provider" TEXT,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "providerId" INTEGER,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "canSeeOtherPeople" BOOLEAN NOT NULL DEFAULT false,
    "canEditOtherPeople" BOOLEAN NOT NULL DEFAULT false,
    "canManagePeople" BOOLEAN NOT NULL DEFAULT false,
    "canManageRoles" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Script" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "vertical" TEXT,
    "brand" JSONB NOT NULL DEFAULT '["cimet"]',
    "category" "ScriptCategoryType" NOT NULL DEFAULT 'optional',
    "connectionType" "ScriptConnectionTypeType",
    "technologyType" "ScriptTechnologyTypeType",
    "position" "ScriptPositionType" DEFAULT 'top_left',
    "order" INTEGER DEFAULT 0,
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',

    CONSTRAINT "Script_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL DEFAULT '',
    "sectionOrder" INTEGER,
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "pages" TEXT,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubAffiliate" (
    "id" TEXT NOT NULL,
    "subAffiliateId" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "rcCode" TEXT NOT NULL DEFAULT '',
    "apiKey" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "SubAffiliate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vertical" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT,
    "link" TEXT,

    CONSTRAINT "Vertical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BalanceTransfer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "creditCard" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "minBTAmount" INTEGER,
    "maxBTAmount" INTEGER,
    "maxBTPercent" DECIMAL(4,2),
    "btConditions" TEXT NOT NULL DEFAULT '',
    "isBTFromPersonalLoanAllowed" BOOLEAN NOT NULL DEFAULT false,
    "btFeeDollars" DOUBLE PRECISION,
    "btFeePercent" DECIMAL(4,2),
    "btIntro" DOUBLE PRECISION,
    "btIntroTerm" INTEGER,
    "btNotAllowedFromBanks" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "BalanceTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "uuid" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "image" TEXT,
    "provider" TEXT,
    "cardNetwork" "CreditCardCardNetworkType" NOT NULL,
    "cardType" "CreditCardCardTypeType" NOT NULL,
    "isLowRate" BOOLEAN NOT NULL DEFAULT false,
    "isLowFee" BOOLEAN NOT NULL DEFAULT false,
    "isReward" BOOLEAN NOT NULL DEFAULT false,
    "isStoreCard" BOOLEAN NOT NULL DEFAULT false,
    "interestFreeDays" INTEGER,
    "minRepaymentDollars" INTEGER,
    "minRepaymentPercent" DECIMAL(4,2),
    "minCreditLimit" INTEGER,
    "maxCreditLimit" INTEGER,
    "purchaseRateStandard" DECIMAL(4,2),
    "purchaseRateIntro" DECIMAL(4,2),
    "purchaseRateIntroTerm" INTEGER,
    "foreignExchangeFeeStandard" DECIMAL(4,2),
    "atmFeeStandard" DECIMAL(4,2),
    "cashAdvRateStandard" DECIMAL(4,2),
    "cashAdvRateIntro" DECIMAL(4,2),
    "cashAdvRateIntroTerm" INTEGER,
    "dishonourFee" DECIMAL(4,2),
    "paperStatementFee" DECIMAL(4,2),
    "overlimitFee" DECIMAL(4,2),
    "informationRequestFee" DECIMAL(4,2),
    "voucherRequestFee" DECIMAL(4,2),
    "additionalCardHolders" INTEGER,
    "additionalCardHoldersFee" DECIMAL(4,2),
    "ewalletPaymentOptions" TEXT,
    "overTheCounterTransactionFee" DECIMAL(4,2),
    "minAge" INTEGER,
    "minIncome" INTEGER,
    "residency" JSONB NOT NULL DEFAULT '[]',
    "eligibilityCondition" TEXT NOT NULL DEFAULT '',
    "minCreditScore" TEXT,
    "bonusPoints" INTEGER,
    "rewardProgram" TEXT,
    "fees" TEXT,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarnRate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "provider" TEXT,
    "creditCard" TEXT,
    "isGenericEarnRate" BOOLEAN NOT NULL DEFAULT false,
    "pointsEarned" INTEGER DEFAULT 0,
    "spendAt" TEXT NOT NULL DEFAULT '',
    "rangeMinimum" INTEGER,
    "rangeMax" INTEGER,
    "rangeUnit" "EarnRateRangeUnitType",
    "rangePeriod" "EarnRateRangePeriodType",

    CONSTRAINT "EarnRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCardFee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "annualFeeIntro" INTEGER,
    "annualFeeIntroTerm" INTEGER,
    "annualFeeStandard" INTEGER DEFAULT 0,
    "annualFeeSpendWaiver" INTEGER,
    "annualFeeSpendWaiverTerm" INTEGER,
    "annualFeeOtherWaiver" TEXT NOT NULL DEFAULT '',
    "cashAdvanceMinFee" INTEGER,
    "cashAdvanceMaxFee" INTEGER,
    "cashAdvancePercent" DECIMAL(4,2),
    "fxFeeVisaDollar" INTEGER,
    "fxFeeVisaPercent" DECIMAL(4,2),
    "fxFeeVisaAtm" INTEGER,
    "visaOverseasReplaceCardFee" INTEGER,
    "fxFeeMcDollar" INTEGER,
    "fxFeeMcPercent" DECIMAL(4,2),
    "fxFeeMcATM" INTEGER,
    "mcOverseasReplaceCardFee" INTEGER,
    "fxFeeAmexDollar" INTEGER,
    "fxFeeAmexPercent" DECIMAL(4,2),
    "fxFeeAmexATM" INTEGER,
    "amexOverseasReplaceCardFee" INTEGER,
    "fxFeeAmexAUDatInternational" INTEGER,
    "latePaymentFee" INTEGER,
    "overLimitFee" INTEGER,
    "duplicateStatementFee" INTEGER,

    CONSTRAINT "CreditCardFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perk" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "provider" TEXT,
    "creditCard" TEXT,
    "type" TEXT NOT NULL DEFAULT '',
    "value" INTEGER,
    "assumptions" TEXT NOT NULL DEFAULT '',
    "conditions" TEXT NOT NULL DEFAULT '',
    "days" INTEGER,
    "daysConditions" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Perk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderCreditCard" (
    "id" TEXT NOT NULL,
    "availableStates" JSONB NOT NULL DEFAULT '[]',
    "provider" TEXT,

    CONSTRAINT "ProviderCreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redemption" (
    "id" TEXT NOT NULL,
    "rewardProgram" TEXT,
    "type" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "price" DOUBLE PRECISION,
    "priceMethod" TEXT NOT NULL DEFAULT '',
    "pointsRequired" INTEGER NOT NULL,

    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardProgram" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "isReward" BOOLEAN NOT NULL DEFAULT false,
    "isPartner" BOOLEAN NOT NULL DEFAULT false,
    "isFrequentFluer" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RewardProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Special" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "type" JSONB NOT NULL DEFAULT '[]',
    "defaultType" TEXT,
    "introText" TEXT NOT NULL DEFAULT '',
    "blurb" TEXT NOT NULL DEFAULT '',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "url" TEXT NOT NULL DEFAULT '',
    "company" TEXT,
    "creditCard" TEXT,

    CONSTRAINT "Special_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battery" (
    "id" TEXT NOT NULL,
    "modelNumber" TEXT NOT NULL DEFAULT '',
    "series" TEXT NOT NULL DEFAULT '',
    "const" DECIMAL(4,2),
    "efficiency" DOUBLE PRECISION,
    "outerDimensions" TEXT NOT NULL DEFAULT '',
    "weight" DOUBLE PRECISION,
    "countryOfManufacturing" TEXT NOT NULL DEFAULT '',
    "warranty" INTEGER,
    "warrantyClaims" DOUBLE PRECISION,
    "powerRating" INTEGER,
    "size" DOUBLE PRECISION,
    "roundtripEfficiency" INTEGER,
    "lifetime" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "details" TEXT NOT NULL DEFAULT '',
    "approveDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Installer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "logo" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Installer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallerContact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "type" "InstallerContactTypeType" DEFAULT 'mobile',
    "contactNumber" INTEGER NOT NULL,
    "installer" TEXT,

    CONSTRAINT "InstallerContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallerLicense" (
    "id" TEXT NOT NULL,
    "installer" TEXT,
    "state" TEXT,
    "recLicenseNumber" TEXT NOT NULL DEFAULT '',
    "postcodes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "InstallerLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallerInverter" (
    "id" TEXT NOT NULL,
    "installer" TEXT,
    "inverter" TEXT,
    "cost" DOUBLE PRECISION,
    "warranty" INTEGER,
    "warrantyClaims" DOUBLE PRECISION,
    "image" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "InstallerInverter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallerSolarPanel" (
    "id" TEXT NOT NULL,
    "installer" TEXT,
    "inverter" TEXT,
    "cost" DOUBLE PRECISION,
    "warranty" INTEGER,
    "warrantyClaims" DOUBLE PRECISION,
    "image" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "InstallerSolarPanel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallerBattery" (
    "id" TEXT NOT NULL,
    "installer" TEXT,
    "battery" TEXT,
    "cost" DOUBLE PRECISION,
    "warranty" INTEGER,
    "warrantyClaims" DOUBLE PRECISION,
    "image" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "InstallerBattery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inverter" (
    "id" TEXT NOT NULL,
    "modelNumber" TEXT NOT NULL DEFAULT '',
    "series" TEXT NOT NULL DEFAULT '',
    "outputCurrent" INTEGER,
    "powerRating" INTEGER,
    "maxEfficiency" DOUBLE PRECISION,
    "outerDimensions" TEXT NOT NULL DEFAULT '',
    "weight" DOUBLE PRECISION,
    "countryOfManufacturing" TEXT NOT NULL DEFAULT '',
    "warranty" INTEGER,
    "warrantyClaims" DOUBLE PRECISION,
    "details" TEXT NOT NULL DEFAULT '',
    "approveDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inverter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PvBundle" (
    "id" TEXT NOT NULL,
    "installer" TEXT,
    "solarPanel" TEXT,
    "inverter" TEXT,
    "battery" TEXT,
    "totalCost" DOUBLE PRECISION,
    "stcRebate" DOUBLE PRECISION,
    "finalCost" DOUBLE PRECISION,
    "capacity" DOUBLE PRECISION,
    "numberOfPanels" INTEGER,
    "areaNeeded" INTEGER,

    CONSTRAINT "PvBundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolarAddon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "const" DOUBLE PRECISION,
    "bundle" TEXT,

    CONSTRAINT "SolarAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolarPanel" (
    "id" TEXT NOT NULL,
    "modelNumber" TEXT NOT NULL DEFAULT '',
    "series" TEXT NOT NULL DEFAULT '',
    "capacity" DOUBLE PRECISION,
    "efficiency" TEXT NOT NULL DEFAULT '',
    "outerDimensions" TEXT NOT NULL DEFAULT '',
    "weight" DOUBLE PRECISION,
    "countryOfManufacturing" TEXT NOT NULL DEFAULT '',
    "warranty" INTEGER,
    "warrantyClaims" DOUBLE PRECISION,
    "details" TEXT NOT NULL DEFAULT '',
    "approveDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolarPanel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddonAttribute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL DEFAULT '',
    "addon" TEXT,

    CONSTRAINT "AddonAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleAttribute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL DEFAULT '',
    "bundle" TEXT,

    CONSTRAINT "BundleAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Addon_plans" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Addon_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Affiliate_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Affiliate_subAffiliates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RewardProgram_icons" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Page_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Page_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Plan_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Provider_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CreditCard_document" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Battery_manufacturer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SolarPanel_manufacturer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Inverter_manufacturer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Addon_addonId_key" ON "Addon"("addonId");

-- CreateIndex
CREATE UNIQUE INDEX "Affiliate_affiliateId_key" ON "Affiliate"("affiliateId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Page_vertical_key" ON "Page"("vertical");

-- CreateIndex
CREATE INDEX "Page_thumbnail_idx" ON "Page"("thumbnail");

-- CreateIndex
CREATE INDEX "Page_heroImage_idx" ON "Page"("heroImage");

-- CreateIndex
CREATE INDEX "Page_author_idx" ON "Page"("author");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_planId_key" ON "Plan"("planId");

-- CreateIndex
CREATE INDEX "Plan_provider_idx" ON "Plan"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_providerId_key" ON "Provider"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Script_slug_key" ON "Script"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Script_vertical_key" ON "Script"("vertical");

-- CreateIndex
CREATE INDEX "Section_pages_idx" ON "Section"("pages");

-- CreateIndex
CREATE UNIQUE INDEX "SubAffiliate_subAffiliateId_key" ON "SubAffiliate"("subAffiliateId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Vertical_slug_key" ON "Vertical"("slug");

-- CreateIndex
CREATE INDEX "Vertical_icon_idx" ON "Vertical"("icon");

-- CreateIndex
CREATE INDEX "Vertical_link_idx" ON "Vertical"("link");

-- CreateIndex
CREATE UNIQUE INDEX "BalanceTransfer_creditCard_key" ON "BalanceTransfer"("creditCard");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_uuid_key" ON "CreditCard"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_fees_key" ON "CreditCard"("fees");

-- CreateIndex
CREATE INDEX "CreditCard_image_idx" ON "CreditCard"("image");

-- CreateIndex
CREATE INDEX "CreditCard_provider_idx" ON "CreditCard"("provider");

-- CreateIndex
CREATE INDEX "CreditCard_rewardProgram_idx" ON "CreditCard"("rewardProgram");

-- CreateIndex
CREATE INDEX "EarnRate_provider_idx" ON "EarnRate"("provider");

-- CreateIndex
CREATE INDEX "EarnRate_creditCard_idx" ON "EarnRate"("creditCard");

-- CreateIndex
CREATE INDEX "Perk_provider_idx" ON "Perk"("provider");

-- CreateIndex
CREATE INDEX "Perk_creditCard_idx" ON "Perk"("creditCard");

-- CreateIndex
CREATE INDEX "ProviderCreditCard_provider_idx" ON "ProviderCreditCard"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_type_key" ON "Redemption"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_name_key" ON "Redemption"("name");

-- CreateIndex
CREATE INDEX "Redemption_rewardProgram_idx" ON "Redemption"("rewardProgram");

-- CreateIndex
CREATE INDEX "Special_company_idx" ON "Special"("company");

-- CreateIndex
CREATE INDEX "Special_creditCard_idx" ON "Special"("creditCard");

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_name_key" ON "Manufacturer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Installer_name_key" ON "Installer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InstallerContact_contactNumber_key" ON "InstallerContact"("contactNumber");

-- CreateIndex
CREATE INDEX "InstallerContact_installer_idx" ON "InstallerContact"("installer");

-- CreateIndex
CREATE UNIQUE INDEX "InstallerLicense_recLicenseNumber_key" ON "InstallerLicense"("recLicenseNumber");

-- CreateIndex
CREATE INDEX "InstallerLicense_installer_idx" ON "InstallerLicense"("installer");

-- CreateIndex
CREATE INDEX "InstallerLicense_state_idx" ON "InstallerLicense"("state");

-- CreateIndex
CREATE INDEX "InstallerInverter_installer_idx" ON "InstallerInverter"("installer");

-- CreateIndex
CREATE INDEX "InstallerInverter_inverter_idx" ON "InstallerInverter"("inverter");

-- CreateIndex
CREATE INDEX "InstallerSolarPanel_installer_idx" ON "InstallerSolarPanel"("installer");

-- CreateIndex
CREATE INDEX "InstallerSolarPanel_inverter_idx" ON "InstallerSolarPanel"("inverter");

-- CreateIndex
CREATE INDEX "InstallerBattery_installer_idx" ON "InstallerBattery"("installer");

-- CreateIndex
CREATE INDEX "InstallerBattery_battery_idx" ON "InstallerBattery"("battery");

-- CreateIndex
CREATE INDEX "PvBundle_installer_idx" ON "PvBundle"("installer");

-- CreateIndex
CREATE INDEX "PvBundle_solarPanel_idx" ON "PvBundle"("solarPanel");

-- CreateIndex
CREATE INDEX "PvBundle_inverter_idx" ON "PvBundle"("inverter");

-- CreateIndex
CREATE INDEX "PvBundle_battery_idx" ON "PvBundle"("battery");

-- CreateIndex
CREATE UNIQUE INDEX "SolarAddon_name_key" ON "SolarAddon"("name");

-- CreateIndex
CREATE INDEX "SolarAddon_bundle_idx" ON "SolarAddon"("bundle");

-- CreateIndex
CREATE UNIQUE INDEX "AddonAttribute_name_key" ON "AddonAttribute"("name");

-- CreateIndex
CREATE INDEX "AddonAttribute_addon_idx" ON "AddonAttribute"("addon");

-- CreateIndex
CREATE UNIQUE INDEX "BundleAttribute_name_key" ON "BundleAttribute"("name");

-- CreateIndex
CREATE INDEX "BundleAttribute_bundle_idx" ON "BundleAttribute"("bundle");

-- CreateIndex
CREATE UNIQUE INDEX "_Addon_plans_AB_unique" ON "_Addon_plans"("A", "B");

-- CreateIndex
CREATE INDEX "_Addon_plans_B_index" ON "_Addon_plans"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Addon_scripts_AB_unique" ON "_Addon_scripts"("A", "B");

-- CreateIndex
CREATE INDEX "_Addon_scripts_B_index" ON "_Addon_scripts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Affiliate_scripts_AB_unique" ON "_Affiliate_scripts"("A", "B");

-- CreateIndex
CREATE INDEX "_Affiliate_scripts_B_index" ON "_Affiliate_scripts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Affiliate_subAffiliates_AB_unique" ON "_Affiliate_subAffiliates"("A", "B");

-- CreateIndex
CREATE INDEX "_Affiliate_subAffiliates_B_index" ON "_Affiliate_subAffiliates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RewardProgram_icons_AB_unique" ON "_RewardProgram_icons"("A", "B");

-- CreateIndex
CREATE INDEX "_RewardProgram_icons_B_index" ON "_RewardProgram_icons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Page_tags_AB_unique" ON "_Page_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Page_tags_B_index" ON "_Page_tags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Page_scripts_AB_unique" ON "_Page_scripts"("A", "B");

-- CreateIndex
CREATE INDEX "_Page_scripts_B_index" ON "_Page_scripts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Plan_scripts_AB_unique" ON "_Plan_scripts"("A", "B");

-- CreateIndex
CREATE INDEX "_Plan_scripts_B_index" ON "_Plan_scripts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Provider_scripts_AB_unique" ON "_Provider_scripts"("A", "B");

-- CreateIndex
CREATE INDEX "_Provider_scripts_B_index" ON "_Provider_scripts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CreditCard_document_AB_unique" ON "_CreditCard_document"("A", "B");

-- CreateIndex
CREATE INDEX "_CreditCard_document_B_index" ON "_CreditCard_document"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Battery_manufacturer_AB_unique" ON "_Battery_manufacturer"("A", "B");

-- CreateIndex
CREATE INDEX "_Battery_manufacturer_B_index" ON "_Battery_manufacturer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SolarPanel_manufacturer_AB_unique" ON "_SolarPanel_manufacturer"("A", "B");

-- CreateIndex
CREATE INDEX "_SolarPanel_manufacturer_B_index" ON "_SolarPanel_manufacturer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Inverter_manufacturer_AB_unique" ON "_Inverter_manufacturer"("A", "B");

-- CreateIndex
CREATE INDEX "_Inverter_manufacturer_B_index" ON "_Inverter_manufacturer"("B");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_thumbnail_fkey" FOREIGN KEY ("thumbnail") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_heroImage_fkey" FOREIGN KEY ("heroImage") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_vertical_fkey" FOREIGN KEY ("vertical") REFERENCES "Vertical"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_provider_fkey" FOREIGN KEY ("provider") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_vertical_fkey" FOREIGN KEY ("vertical") REFERENCES "Vertical"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_pages_fkey" FOREIGN KEY ("pages") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vertical" ADD CONSTRAINT "Vertical_icon_fkey" FOREIGN KEY ("icon") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vertical" ADD CONSTRAINT "Vertical_link_fkey" FOREIGN KEY ("link") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceTransfer" ADD CONSTRAINT "BalanceTransfer_creditCard_fkey" FOREIGN KEY ("creditCard") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_image_fkey" FOREIGN KEY ("image") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_provider_fkey" FOREIGN KEY ("provider") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_rewardProgram_fkey" FOREIGN KEY ("rewardProgram") REFERENCES "RewardProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_fees_fkey" FOREIGN KEY ("fees") REFERENCES "CreditCardFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarnRate" ADD CONSTRAINT "EarnRate_provider_fkey" FOREIGN KEY ("provider") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarnRate" ADD CONSTRAINT "EarnRate_creditCard_fkey" FOREIGN KEY ("creditCard") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perk" ADD CONSTRAINT "Perk_provider_fkey" FOREIGN KEY ("provider") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perk" ADD CONSTRAINT "Perk_creditCard_fkey" FOREIGN KEY ("creditCard") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCreditCard" ADD CONSTRAINT "ProviderCreditCard_provider_fkey" FOREIGN KEY ("provider") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_rewardProgram_fkey" FOREIGN KEY ("rewardProgram") REFERENCES "RewardProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Special" ADD CONSTRAINT "Special_company_fkey" FOREIGN KEY ("company") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Special" ADD CONSTRAINT "Special_creditCard_fkey" FOREIGN KEY ("creditCard") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerContact" ADD CONSTRAINT "InstallerContact_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerLicense" ADD CONSTRAINT "InstallerLicense_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerLicense" ADD CONSTRAINT "InstallerLicense_state_fkey" FOREIGN KEY ("state") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerInverter" ADD CONSTRAINT "InstallerInverter_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerInverter" ADD CONSTRAINT "InstallerInverter_inverter_fkey" FOREIGN KEY ("inverter") REFERENCES "Inverter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerSolarPanel" ADD CONSTRAINT "InstallerSolarPanel_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerSolarPanel" ADD CONSTRAINT "InstallerSolarPanel_inverter_fkey" FOREIGN KEY ("inverter") REFERENCES "Inverter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerBattery" ADD CONSTRAINT "InstallerBattery_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallerBattery" ADD CONSTRAINT "InstallerBattery_battery_fkey" FOREIGN KEY ("battery") REFERENCES "Battery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvBundle" ADD CONSTRAINT "PvBundle_installer_fkey" FOREIGN KEY ("installer") REFERENCES "Installer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvBundle" ADD CONSTRAINT "PvBundle_solarPanel_fkey" FOREIGN KEY ("solarPanel") REFERENCES "SolarPanel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvBundle" ADD CONSTRAINT "PvBundle_inverter_fkey" FOREIGN KEY ("inverter") REFERENCES "Inverter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvBundle" ADD CONSTRAINT "PvBundle_battery_fkey" FOREIGN KEY ("battery") REFERENCES "Battery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarAddon" ADD CONSTRAINT "SolarAddon_bundle_fkey" FOREIGN KEY ("bundle") REFERENCES "PvBundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddonAttribute" ADD CONSTRAINT "AddonAttribute_addon_fkey" FOREIGN KEY ("addon") REFERENCES "SolarAddon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleAttribute" ADD CONSTRAINT "BundleAttribute_bundle_fkey" FOREIGN KEY ("bundle") REFERENCES "PvBundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Addon_plans" ADD CONSTRAINT "_Addon_plans_A_fkey" FOREIGN KEY ("A") REFERENCES "Addon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Addon_plans" ADD CONSTRAINT "_Addon_plans_B_fkey" FOREIGN KEY ("B") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Addon_scripts" ADD CONSTRAINT "_Addon_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "Addon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Addon_scripts" ADD CONSTRAINT "_Addon_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Affiliate_scripts" ADD CONSTRAINT "_Affiliate_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Affiliate_scripts" ADD CONSTRAINT "_Affiliate_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Affiliate_subAffiliates" ADD CONSTRAINT "_Affiliate_subAffiliates_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Affiliate_subAffiliates" ADD CONSTRAINT "_Affiliate_subAffiliates_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RewardProgram_icons" ADD CONSTRAINT "_RewardProgram_icons_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RewardProgram_icons" ADD CONSTRAINT "_RewardProgram_icons_B_fkey" FOREIGN KEY ("B") REFERENCES "RewardProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Page_tags" ADD CONSTRAINT "_Page_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Page_tags" ADD CONSTRAINT "_Page_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Page_scripts" ADD CONSTRAINT "_Page_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Page_scripts" ADD CONSTRAINT "_Page_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Plan_scripts" ADD CONSTRAINT "_Plan_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Plan_scripts" ADD CONSTRAINT "_Plan_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Provider_scripts" ADD CONSTRAINT "_Provider_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Provider_scripts" ADD CONSTRAINT "_Provider_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_document" ADD CONSTRAINT "_CreditCard_document_A_fkey" FOREIGN KEY ("A") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_document" ADD CONSTRAINT "_CreditCard_document_B_fkey" FOREIGN KEY ("B") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Battery_manufacturer" ADD CONSTRAINT "_Battery_manufacturer_A_fkey" FOREIGN KEY ("A") REFERENCES "Battery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Battery_manufacturer" ADD CONSTRAINT "_Battery_manufacturer_B_fkey" FOREIGN KEY ("B") REFERENCES "Manufacturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolarPanel_manufacturer" ADD CONSTRAINT "_SolarPanel_manufacturer_A_fkey" FOREIGN KEY ("A") REFERENCES "Manufacturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolarPanel_manufacturer" ADD CONSTRAINT "_SolarPanel_manufacturer_B_fkey" FOREIGN KEY ("B") REFERENCES "SolarPanel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Inverter_manufacturer" ADD CONSTRAINT "_Inverter_manufacturer_A_fkey" FOREIGN KEY ("A") REFERENCES "Inverter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Inverter_manufacturer" ADD CONSTRAINT "_Inverter_manufacturer_B_fkey" FOREIGN KEY ("B") REFERENCES "Manufacturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

