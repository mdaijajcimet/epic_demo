-- AlterTable
ALTER TABLE "CsSite" ADD COLUMN     "affAuthCallbackUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "affAuthQuery" TEXT NOT NULL DEFAULT 'token',
ADD COLUMN     "affAuthUrl" TEXT NOT NULL DEFAULT '';
