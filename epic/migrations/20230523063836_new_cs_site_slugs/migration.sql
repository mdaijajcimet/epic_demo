-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CsSiteSlugType" ADD VALUE 'youcompare';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'cohort';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'quote';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'threequotes';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'hytech';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'lsre';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'energymatters';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'shinehub';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'comparision';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'ayla';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'electricityandgas';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'comparenselect';
ALTER TYPE "CsSiteSlugType" ADD VALUE 'billy';
