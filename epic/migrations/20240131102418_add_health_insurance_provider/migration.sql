-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "postSubmissionContent" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "HIProvider" (
    "id" TEXT NOT NULL,
    "provider" TEXT,
    "hasAllAffiliates" BOOLEAN NOT NULL DEFAULT false,
    "tagSubAffiliates" TEXT,

    CONSTRAINT "HIProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HIProvider_affiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "HIProvider_provider_idx" ON "HIProvider"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "_HIProvider_affiliate_AB_unique" ON "_HIProvider_affiliate"("A", "B");

-- CreateIndex
CREATE INDEX "_HIProvider_affiliate_B_index" ON "_HIProvider_affiliate"("B");

-- AddForeignKey
ALTER TABLE "HIProvider" ADD CONSTRAINT "HIProvider_provider_fkey" FOREIGN KEY ("provider") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HIProvider_affiliate" ADD CONSTRAINT "_HIProvider_affiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HIProvider_affiliate" ADD CONSTRAINT "_HIProvider_affiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "HIProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
