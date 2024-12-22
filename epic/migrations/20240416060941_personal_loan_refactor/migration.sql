
UPDATE "public"."PersonalLoan" SET "features" = NULL;
UPDATE "public"."PersonalLoan" SET "fees" = NULL;

ALTER TABLE "Eligibility" DROP CONSTRAINT "Eligibility_personalLoan_fkey";
ALTER TABLE "Perk" DROP CONSTRAINT "Perk_personalLoan_fkey";

DROP INDEX "Eligibility_personalLoan_key";
DROP INDEX "Perk_personalLoan_idx";

ALTER TABLE "Eligibility" DROP COLUMN "personalLoan";
ALTER TABLE "Perk" DROP COLUMN "personalLoan";

ALTER TABLE "PersonalLoan" DROP COLUMN "interestType",
DROP COLUMN "maxComparisonRate",
DROP COLUMN "maxInterestRate",
DROP COLUMN "maxLoanAmount",
DROP COLUMN "maxLoanTerm",
DROP COLUMN "minComparisonRate",
DROP COLUMN "minInterestRate",
DROP COLUMN "minLoanAmount",
DROP COLUMN "minLoanTerm",
DROP COLUMN "repaymentFrequency",
DROP COLUMN "securityType";

ALTER TABLE "PersonalLoan" DROP COLUMN "tagSubAffiliates",
ADD COLUMN     "eligibility" TEXT;

CREATE TABLE "PLEligibility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "minAge" INTEGER,
    "minIncome" INTEGER,
    "eligibilityCondition" TEXT NOT NULL DEFAULT '',
    "residency" JSONB NOT NULL DEFAULT '[]',
    "visaValidity" INTEGER,

    CONSTRAINT "PLEligibility_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PLPerk" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "type" JSONB NOT NULL DEFAULT '[]',
    "value" INTEGER,
    "assumptions" TEXT NOT NULL DEFAULT '',
    "conditions" TEXT NOT NULL DEFAULT '',
    "days" INTEGER,
    "daysConditions" TEXT NOT NULL DEFAULT '',
    "personalLoan" TEXT,

    CONSTRAINT "PLPerk_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PLLoanDetail" (
    "id" TEXT NOT NULL,
    "interestType" TEXT NOT NULL DEFAULT 'fixed',
    "minLoanAmount" INTEGER NOT NULL,
    "maxLoanAmount" INTEGER,
    "minLoanTerm" INTEGER NOT NULL,
    "maxLoanTerm" INTEGER NOT NULL,
    "minInterestRate" DOUBLE PRECISION NOT NULL,
    "maxInterestRate" DOUBLE PRECISION,
    "minComparisonRate" DOUBLE PRECISION NOT NULL,
    "maxComparisonRate" DOUBLE PRECISION,
    "securityType" TEXT NOT NULL DEFAULT 'secured',
    "repaymentFrequency" JSONB NOT NULL DEFAULT '["monthly","fortnightly","weekly"]',
    "personalLoan" TEXT,

    CONSTRAINT "PLLoanDetail_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_PersonalLoan_subAffiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE INDEX "PLPerk_personalLoan_idx" ON "PLPerk"("personalLoan");

CREATE INDEX "PLLoanDetail_personalLoan_idx" ON "PLLoanDetail"("personalLoan");

CREATE UNIQUE INDEX "_PersonalLoan_subAffiliate_AB_unique" ON "_PersonalLoan_subAffiliate"("A", "B");

CREATE INDEX "_PersonalLoan_subAffiliate_B_index" ON "_PersonalLoan_subAffiliate"("B");

CREATE INDEX "PersonalLoan_eligibility_idx" ON "PersonalLoan"("eligibility");

ALTER TABLE "PersonalLoan" ADD CONSTRAINT "PersonalLoan_eligibility_fkey" FOREIGN KEY ("eligibility") REFERENCES "PLEligibility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PLPerk" ADD CONSTRAINT "PLPerk_personalLoan_fkey" FOREIGN KEY ("personalLoan") REFERENCES "PersonalLoan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PLLoanDetail" ADD CONSTRAINT "PLLoanDetail_personalLoan_fkey" FOREIGN KEY ("personalLoan") REFERENCES "PersonalLoan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "_PersonalLoan_subAffiliate" ADD CONSTRAINT "_PersonalLoan_subAffiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "PersonalLoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_PersonalLoan_subAffiliate" ADD CONSTRAINT "_PersonalLoan_subAffiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PLLoanDetail" DROP CONSTRAINT "PLLoanDetail_personalLoan_fkey";

ALTER TABLE "PersonalLoan" DROP CONSTRAINT "PersonalLoan_keyFactSheet_fkey";

ALTER TABLE "PersonalLoan" DROP CONSTRAINT "PersonalLoan_targetMarketDetermination_fkey";

ALTER TABLE "Special" DROP CONSTRAINT "Special_personalLoan_fkey";

ALTER TABLE "_PersonalLoan_document" DROP CONSTRAINT "_PersonalLoan_document_A_fkey";

ALTER TABLE "_PersonalLoan_document" DROP CONSTRAINT "_PersonalLoan_document_B_fkey";

DROP INDEX "PLLoanDetail_personalLoan_idx";

DROP INDEX "PersonalLoan_keyFactSheet_idx";

DROP INDEX "PersonalLoan_targetMarketDetermination_idx";

DROP INDEX "Special_personalLoan_idx";

ALTER TABLE "PLLoanDetail" DROP COLUMN "personalLoan";

ALTER TABLE "PersonalLoan" DROP COLUMN "keyFactSheet",
DROP COLUMN "otherInformation",
DROP COLUMN "targetMarketDetermination",
ADD COLUMN     "documents" TEXT,
ADD COLUMN     "loanDetail" TEXT;

ALTER TABLE "Special" DROP COLUMN "personalLoan";

DROP TABLE "_PersonalLoan_document";

CREATE TABLE "PLDocument" (
    "id" TEXT NOT NULL,
    "keyFactSheet" TEXT,
    "targetMarketDetermination" TEXT,
    "otherInformation" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "PLDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PLSpecial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "type" JSONB NOT NULL DEFAULT '[]',
    "introText" TEXT NOT NULL DEFAULT '',
    "blurb" TEXT NOT NULL DEFAULT '',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "url" TEXT NOT NULL DEFAULT '',
    "personalLoan" TEXT,

    CONSTRAINT "PLSpecial_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_PLDocument_document" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE INDEX "PLDocument_keyFactSheet_idx" ON "PLDocument"("keyFactSheet");

CREATE INDEX "PLDocument_targetMarketDetermination_idx" ON "PLDocument"("targetMarketDetermination");

CREATE INDEX "PLSpecial_personalLoan_idx" ON "PLSpecial"("personalLoan");

CREATE UNIQUE INDEX "_PLDocument_document_AB_unique" ON "_PLDocument_document"("A", "B");

CREATE INDEX "_PLDocument_document_B_index" ON "_PLDocument_document"("B");

CREATE UNIQUE INDEX "PersonalLoan_loanDetail_key" ON "PersonalLoan"("loanDetail");

CREATE INDEX "PersonalLoan_documents_idx" ON "PersonalLoan"("documents");

ALTER TABLE "PersonalLoan" ADD CONSTRAINT "PersonalLoan_loanDetail_fkey" FOREIGN KEY ("loanDetail") REFERENCES "PLLoanDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PersonalLoan" ADD CONSTRAINT "PersonalLoan_documents_fkey" FOREIGN KEY ("documents") REFERENCES "PLDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PLDocument" ADD CONSTRAINT "PLDocument_keyFactSheet_fkey" FOREIGN KEY ("keyFactSheet") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PLDocument" ADD CONSTRAINT "PLDocument_targetMarketDetermination_fkey" FOREIGN KEY ("targetMarketDetermination") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PLSpecial" ADD CONSTRAINT "PLSpecial_personalLoan_fkey" FOREIGN KEY ("personalLoan") REFERENCES "PersonalLoan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "_PLDocument_document" ADD CONSTRAINT "_PLDocument_document_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_PLDocument_document" ADD CONSTRAINT "_PLDocument_document_B_fkey" FOREIGN KEY ("B") REFERENCES "PLDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP INDEX "PersonalLoan_features_idx";
DROP INDEX "PersonalLoan_fees_idx";

ALTER TABLE "PLDocument" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "PLEligibility" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "PLLoanDetail" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "PLPerk" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "PLSpecial" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Special" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "PersonalLoan_fees_key" ON "PersonalLoan"("fees");
CREATE UNIQUE INDEX "PersonalLoan_features_key" ON "PersonalLoan"("features");

ALTER TABLE "HIProvider" DROP COLUMN "tagSubAffiliates";

ALTER TABLE "PLProvider" DROP COLUMN "tagSubAffiliates";

CREATE TABLE "_HIProvider_subAffiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE TABLE "_PLProvider_subAffiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_HIProvider_subAffiliate_AB_unique" ON "_HIProvider_subAffiliate"("A", "B");

CREATE INDEX "_HIProvider_subAffiliate_B_index" ON "_HIProvider_subAffiliate"("B");

CREATE UNIQUE INDEX "_PLProvider_subAffiliate_AB_unique" ON "_PLProvider_subAffiliate"("A", "B");

CREATE INDEX "_PLProvider_subAffiliate_B_index" ON "_PLProvider_subAffiliate"("B");

ALTER TABLE "_HIProvider_subAffiliate" ADD CONSTRAINT "_HIProvider_subAffiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "HIProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_HIProvider_subAffiliate" ADD CONSTRAINT "_HIProvider_subAffiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_PLProvider_subAffiliate" ADD CONSTRAINT "_PLProvider_subAffiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "PLProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_PLProvider_subAffiliate" ADD CONSTRAINT "_PLProvider_subAffiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "SubAffiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PLFee" DROP COLUMN "name";

DROP INDEX "PersonalLoan_documents_idx";

CREATE UNIQUE INDEX "PersonalLoan_documents_key" ON "PersonalLoan"("documents");

ALTER TABLE "PLDocument" DROP COLUMN "otherInformation";

ALTER TABLE "PLLoanDetail" ADD COLUMN     "otherInformation" TEXT NOT NULL DEFAULT '';

ALTER TABLE "PLFeature" DROP COLUMN "name";

ALTER TABLE "PLProvider" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "PLFeature" DROP COLUMN "fundingTime",
DROP COLUMN "fundingTimeFrequency";

ALTER TABLE "PLLoanDetail" ADD COLUMN     "fundingTime" INTEGER,
ADD COLUMN     "fundingTimeFrequency" TEXT;

ALTER TABLE "Special" DROP COLUMN "defaultType";

ALTER TABLE "HIProvider" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
