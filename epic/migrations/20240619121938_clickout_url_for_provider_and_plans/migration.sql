-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "clickoutParams" JSONB,
ADD COLUMN     "clickoutStatus" TEXT NOT NULL DEFAULT 'no';

-- AlterTable
ALTER TABLE "HIProvider" ADD COLUMN     "clickoutParams" JSONB,
ADD COLUMN     "clickoutStatus" TEXT NOT NULL DEFAULT 'no';

-- AlterTable
ALTER TABLE "PLProvider" ADD COLUMN     "clickoutParams" JSONB,
ADD COLUMN     "clickoutStatus" TEXT NOT NULL DEFAULT 'no';

-- AlterTable
ALTER TABLE "PersonalLoan" ADD COLUMN     "clickoutParams" JSONB,
ADD COLUMN     "clickoutStatus" TEXT NOT NULL DEFAULT 'no';

-- AlterTable
ALTER TABLE "ProviderCreditCard" ADD COLUMN     "clickoutParams" JSONB,
ADD COLUMN     "clickoutStatus" TEXT NOT NULL DEFAULT 'no';
