-- AlterTable
ALTER TABLE "BundleFormContainer" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CCFormContainer" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "HIFormContainer" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PLFormContainer" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;
