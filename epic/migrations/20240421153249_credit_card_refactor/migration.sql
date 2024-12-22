ALTER TABLE "EarnRate" DROP CONSTRAINT "EarnRate_provider_fkey";
ALTER TABLE "Special" DROP CONSTRAINT "Special_company_fkey";

DROP INDEX "EarnRate_provider_idx";
DROP INDEX "Special_company_idx";

ALTER TABLE "CardDetail"
ADD COLUMN     "hasCashbackOffers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLowFee" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLowRate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isReward" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStoreCard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quickApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bonusPointDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "bonusPoints" INTEGER,
ADD COLUMN     "calculationMethodology" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cardLevel" TEXT NOT NULL DEFAULT 'standard',
ADD COLUMN     "cardNetwork" TEXT NOT NULL DEFAULT 'visa',
ADD COLUMN     "cashbackDiscounts" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ewalletPaymentOptions" JSONB NOT NULL DEFAULT '[]';

UPDATE "CardDetail"
SET 
    "hasCashbackOffers" = "CreditCard"."hasCashbackOffers",
    "isLowFee" = "CreditCard"."isLowFee",
    "isLowRate" = "CreditCard"."isLowRate",
    "isReward" = "CreditCard"."isReward",
    "isStoreCard" = "CreditCard"."isStoreCard",
    "quickApproval" = "CreditCard"."quickApproval",
    "bonusPointDescription" = "CreditCard"."bonusPointDescription",
    "bonusPoints" = "CreditCard"."bonusPoints",
    "calculationMethodology" = "CreditCard"."calculationMethodology",
    "cardLevel" = "CreditCard"."cardLevel",
    "cardNetwork" = "CreditCard"."cardNetwork",
    "cashbackDiscounts" = "CreditCard"."cashbackDiscounts",
    "ewalletPaymentOptions" = "CreditCard"."ewalletPaymentOptions"
FROM "CreditCard"
WHERE "CardDetail"."creditCard" = "CreditCard"."id";

ALTER TABLE "CreditCard" DROP COLUMN "hasCashbackOffers",
DROP COLUMN "isLowFee",
DROP COLUMN "isLowRate",
DROP COLUMN "isReward",
DROP COLUMN "isStoreCard",
DROP COLUMN "quickApproval",
DROP COLUMN "bonusPointDescription",
DROP COLUMN "bonusPoints",
DROP COLUMN "calculationMethodology",
DROP COLUMN "cardLevel",
DROP COLUMN "cardNetwork",
DROP COLUMN "cashbackDiscounts",
DROP COLUMN "ewalletPaymentOptions";

ALTER TABLE "EarnRate" DROP COLUMN "provider";
ALTER TABLE "Special" DROP COLUMN "company";


ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_eligibility_fkey";
ALTER TABLE "Perk" DROP CONSTRAINT "Perk_creditCard_fkey";
ALTER TABLE "Perk" DROP CONSTRAINT "Perk_provider_fkey";

DROP INDEX "CreditCard_eligibility_key";
ALTER TABLE "CreditCard" DROP COLUMN "eligibility";
DROP TABLE "Eligibility";
DROP TABLE "Perk";

ALTER TABLE "CreditCard" ADD COLUMN     "eligibility" TEXT;

CREATE TABLE "CCPerk" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "type" JSONB NOT NULL DEFAULT '[]',
    "value" INTEGER,
    "assumptions" TEXT NOT NULL DEFAULT '',
    "conditions" TEXT NOT NULL DEFAULT '',
    "days" INTEGER,
    "daysConditions" TEXT NOT NULL DEFAULT '',
    "creditCard" TEXT,
    CONSTRAINT "CCPerk_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CCEligibility" (
    "id" TEXT NOT NULL,
    "minAge" INTEGER,
    "minIncome" INTEGER,
    "eligibilityCondition" TEXT NOT NULL DEFAULT '',
    "residency" JSONB NOT NULL DEFAULT '[]',
    "visaValidity" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CCEligibility_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CCPerk_creditCard_idx" ON "CCPerk"("creditCard");
CREATE INDEX "CreditCard_eligibility_idx" ON "CreditCard"("eligibility");

ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_eligibility_fkey" FOREIGN KEY ("eligibility") REFERENCES "CCEligibility"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CCPerk" ADD CONSTRAINT "CCPerk_creditCard_fkey" FOREIGN KEY ("creditCard") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

DROP TYPE "CreditCardCardLevelType";
DROP TYPE "CreditCardCardNetworkType";

CREATE TABLE "CCDocument" (
    "id" TEXT NOT NULL,
    "creditCard" TEXT,
    "keyFactSheet" TEXT,
    "targetMarketDetermination" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CCDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_CCDocument_document" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "CCDocument_creditCard_key" ON "CCDocument"("creditCard");
CREATE INDEX "CCDocument_keyFactSheet_idx" ON "CCDocument"("keyFactSheet");
CREATE INDEX "CCDocument_targetMarketDetermination_idx" ON "CCDocument"("targetMarketDetermination");
CREATE UNIQUE INDEX "_CCDocument_document_AB_unique" ON "_CCDocument_document"("A", "B");
CREATE INDEX "_CCDocument_document_B_index" ON "_CCDocument_document"("B");

ALTER TABLE "CCDocument" ADD CONSTRAINT "CCDocument_creditCard_fkey" FOREIGN KEY ("creditCard") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CCDocument" ADD CONSTRAINT "CCDocument_keyFactSheet_fkey" FOREIGN KEY ("keyFactSheet") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CCDocument" ADD CONSTRAINT "CCDocument_targetMarketDetermination_fkey" FOREIGN KEY ("targetMarketDetermination") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "_CCDocument_document" ADD CONSTRAINT "_CCDocument_document_A_fkey" FOREIGN KEY ("A") REFERENCES "CCDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCDocument_document" ADD CONSTRAINT "_CCDocument_document_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "CCDocument" ("id", "keyFactSheet", "targetMarketDetermination", "creditCard")
SELECT uuid_generate_v4()::text, "keyFactSheet", "targetMarketDetermination", "id" FROM "CreditCard";

ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_keyFactSheet_fkey";
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_targetMarketDetermination_fkey";
ALTER TABLE "_CreditCard_document" DROP CONSTRAINT "_CreditCard_document_A_fkey";
ALTER TABLE "_CreditCard_document" DROP CONSTRAINT "_CreditCard_document_B_fkey";

DROP INDEX "CreditCard_keyFactSheet_idx";
DROP INDEX "CreditCard_targetMarketDetermination_idx";

ALTER TABLE "CreditCard"
DROP COLUMN "keyFactSheet",
DROP COLUMN "targetMarketDetermination";

DROP TABLE "_CreditCard_document";

ALTER TABLE "ProviderCreditCard" ADD COLUMN     "hasAllAffiliates" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "_ProviderCreditCard_affiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE TABLE "_ProviderCreditCard_subAffiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_ProviderCreditCard_affiliate_AB_unique" ON "_ProviderCreditCard_affiliate"("A", "B");
CREATE INDEX "_ProviderCreditCard_affiliate_B_index" ON "_ProviderCreditCard_affiliate"("B");
CREATE UNIQUE INDEX "_ProviderCreditCard_subAffiliate_AB_unique" ON "_ProviderCreditCard_subAffiliate"("A", "B");
CREATE INDEX "_ProviderCreditCard_subAffiliate_B_index" ON "_ProviderCreditCard_subAffiliate"("B");

ALTER TABLE "_ProviderCreditCard_affiliate" ADD CONSTRAINT "_ProviderCreditCard_affiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ProviderCreditCard_affiliate" ADD CONSTRAINT "_ProviderCreditCard_affiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "ProviderCreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ProviderCreditCard_subAffiliate" ADD CONSTRAINT "_ProviderCreditCard_subAffiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "ProviderCreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ProviderCreditCard_subAffiliate" ADD CONSTRAINT "_ProviderCreditCard_subAffiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProviderCreditCard" DROP COLUMN "availableStates";

UPDATE "public"."PersonalLoan" SET "eligibility" = NULL;
DROP INDEX "PersonalLoan_eligibility_idx";
CREATE UNIQUE INDEX "PersonalLoan_eligibility_key" ON "PersonalLoan"("eligibility");

ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_eligibility_fkey";

DROP INDEX "CreditCard_eligibility_idx";
DROP INDEX "CreditCard_rewardProgram_idx";

ALTER TABLE "BalanceTransfer" DROP COLUMN "name";
ALTER TABLE "CCEligibility" ADD COLUMN     "creditCard" TEXT;
ALTER TABLE "CardDetail" DROP COLUMN "name";
ALTER TABLE "CreditCard" DROP COLUMN "eligibility";
ALTER TABLE "CreditCardFee" DROP COLUMN "name";
ALTER TABLE "EarnRate" DROP COLUMN "name";
ALTER TABLE "OverseasSpend" DROP COLUMN "name";
ALTER TABLE "PLEligibility" DROP COLUMN "name";
ALTER TABLE "Rate" DROP COLUMN "name";

UPDATE "public"."CCEligibility" SET "creditCard" = NULL;
UPDATE "public"."CreditCard" SET "rewardProgram" = NULL;

CREATE UNIQUE INDEX "CCEligibility_creditCard_key" ON "CCEligibility"("creditCard");
CREATE UNIQUE INDEX "CreditCard_rewardProgram_key" ON "CreditCard"("rewardProgram");

ALTER TABLE "CCEligibility" ADD CONSTRAINT "CCEligibility_creditCard_fkey" FOREIGN KEY ("creditCard") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
