-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "HIProvider" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "PLProvider" (
    "id" TEXT NOT NULL,
    "provider" TEXT,
    "hasAllAffiliates" BOOLEAN NOT NULL DEFAULT false,
    "tagSubAffiliates" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PLProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalLoan" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'personal',
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "uuid" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "isDiscontinued" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "provider" TEXT,
    "hasAllAffiliates" BOOLEAN NOT NULL DEFAULT false,
    "tagSubAffiliates" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "loanType" TEXT NOT NULL DEFAULT 'fixed',
    "minLoanAmount" INTEGER NOT NULL,
    "maxLoanAmount" INTEGER,
    "minLoanTerm" INTEGER NOT NULL,
    "maxLoanTerm" INTEGER NOT NULL,
    "minInterestRate" DOUBLE PRECISION NOT NULL,
    "maxInterestRate" DOUBLE PRECISION,
    "minComparisonRate" DOUBLE PRECISION NOT NULL,
    "maxComparisonRate" DOUBLE PRECISION,
    "securityType" TEXT NOT NULL DEFAULT 'secured',
    "features" TEXT,
    "fees" TEXT,
    "eligibility" TEXT,
    "keyFactSheet" TEXT,
    "targetMarketDetermination" TEXT,

    CONSTRAINT "PersonalLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PLFee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "minUpfrontFee" DOUBLE PRECISION,
    "maxUpfrontFee" DOUBLE PRECISION,
    "upfrontFeeType" TEXT DEFAULT 'currency',
    "earlyTerminationFee" INTEGER,
    "extraRepaymentFee" INTEGER,
    "missedPaymentPenalty" INTEGER,
    "ongoingFee" INTEGER,
    "overCounterPaymentFee" INTEGER,
    "establishmentFee" INTEGER,
    "brokerageFee" INTEGER,
    "minApplicationFee" DOUBLE PRECISION,
    "maxApplicationFee" DOUBLE PRECISION,
    "applicationFeeType" TEXT DEFAULT 'currency',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PLFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PLFeature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "withExtraRepayment" BOOLEAN NOT NULL DEFAULT false,
    "withRedrawFacility" BOOLEAN NOT NULL DEFAULT false,
    "isFullyDrawnAdvance" BOOLEAN NOT NULL DEFAULT false,
    "withInstantApproval" BOOLEAN NOT NULL DEFAULT false,
    "topUpFacilityAvailable" BOOLEAN NOT NULL DEFAULT false,
    "fundingTime" INTEGER,
    "fundingTimeFrequency" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PLFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PLProvider_affiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonalLoan_affiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonalLoan_perks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonalLoan_creditScores" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonalLoan_specials" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "PLProvider_provider_idx" ON "PLProvider"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalLoan_uuid_key" ON "PersonalLoan"("uuid");

-- CreateIndex
CREATE INDEX "PersonalLoan_image_idx" ON "PersonalLoan"("image");

-- CreateIndex
CREATE INDEX "PersonalLoan_provider_idx" ON "PersonalLoan"("provider");

-- CreateIndex
CREATE INDEX "PersonalLoan_features_idx" ON "PersonalLoan"("features");

-- CreateIndex
CREATE INDEX "PersonalLoan_fees_idx" ON "PersonalLoan"("fees");

-- CreateIndex
CREATE INDEX "PersonalLoan_eligibility_idx" ON "PersonalLoan"("eligibility");

-- CreateIndex
CREATE INDEX "PersonalLoan_keyFactSheet_idx" ON "PersonalLoan"("keyFactSheet");

-- CreateIndex
CREATE INDEX "PersonalLoan_targetMarketDetermination_idx" ON "PersonalLoan"("targetMarketDetermination");

-- CreateIndex
CREATE UNIQUE INDEX "_PLProvider_affiliate_AB_unique" ON "_PLProvider_affiliate"("A", "B");

-- CreateIndex
CREATE INDEX "_PLProvider_affiliate_B_index" ON "_PLProvider_affiliate"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonalLoan_affiliate_AB_unique" ON "_PersonalLoan_affiliate"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonalLoan_affiliate_B_index" ON "_PersonalLoan_affiliate"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonalLoan_perks_AB_unique" ON "_PersonalLoan_perks"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonalLoan_perks_B_index" ON "_PersonalLoan_perks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonalLoan_creditScores_AB_unique" ON "_PersonalLoan_creditScores"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonalLoan_creditScores_B_index" ON "_PersonalLoan_creditScores"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonalLoan_specials_AB_unique" ON "_PersonalLoan_specials"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonalLoan_specials_B_index" ON "_PersonalLoan_specials"("B");

-- AddForeignKey
ALTER TABLE "PLProvider" ADD CONSTRAINT "PLProvider_provider_fkey" FOREIGN KEY ("provider") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalLoan" ADD CONSTRAINT "PersonalLoan_image_fkey" FOREIGN KEY ("image") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalLoan" ADD CONSTRAINT "PersonalLoan_provider_fkey" FOREIGN KEY ("provider") REFERENCES "PLProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalLoan" ADD CONSTRAINT "PersonalLoan_features_fkey" FOREIGN KEY ("features") REFERENCES "PLFeature"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalLoan" ADD CONSTRAINT "PersonalLoan_fees_fkey" FOREIGN KEY ("fees") REFERENCES "PLFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalLoan" ADD CONSTRAINT "PersonalLoan_eligibility_fkey" FOREIGN KEY ("eligibility") REFERENCES "Eligibility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalLoan" ADD CONSTRAINT "PersonalLoan_keyFactSheet_fkey" FOREIGN KEY ("keyFactSheet") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalLoan" ADD CONSTRAINT "PersonalLoan_targetMarketDetermination_fkey" FOREIGN KEY ("targetMarketDetermination") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PLProvider_affiliate" ADD CONSTRAINT "_PLProvider_affiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PLProvider_affiliate" ADD CONSTRAINT "_PLProvider_affiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "PLProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalLoan_affiliate" ADD CONSTRAINT "_PersonalLoan_affiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalLoan_affiliate" ADD CONSTRAINT "_PersonalLoan_affiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "PersonalLoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalLoan_perks" ADD CONSTRAINT "_PersonalLoan_perks_A_fkey" FOREIGN KEY ("A") REFERENCES "Perk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalLoan_perks" ADD CONSTRAINT "_PersonalLoan_perks_B_fkey" FOREIGN KEY ("B") REFERENCES "PersonalLoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalLoan_creditScores" ADD CONSTRAINT "_PersonalLoan_creditScores_A_fkey" FOREIGN KEY ("A") REFERENCES "CreditScore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalLoan_creditScores" ADD CONSTRAINT "_PersonalLoan_creditScores_B_fkey" FOREIGN KEY ("B") REFERENCES "PersonalLoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalLoan_specials" ADD CONSTRAINT "_PersonalLoan_specials_A_fkey" FOREIGN KEY ("A") REFERENCES "PersonalLoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalLoan_specials" ADD CONSTRAINT "_PersonalLoan_specials_B_fkey" FOREIGN KEY ("B") REFERENCES "Special"("id") ON DELETE CASCADE ON UPDATE CASCADE;
