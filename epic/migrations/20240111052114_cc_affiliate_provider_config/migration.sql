-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "hasAllAffiliates" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_CreditCard_affiliate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CreditCard_affiliate_AB_unique" ON "_CreditCard_affiliate"("A", "B");

-- CreateIndex
CREATE INDEX "_CreditCard_affiliate_B_index" ON "_CreditCard_affiliate"("B");

-- AddForeignKey
ALTER TABLE "_CreditCard_affiliate" ADD CONSTRAINT "_CreditCard_affiliate_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_affiliate" ADD CONSTRAINT "_CreditCard_affiliate_B_fkey" FOREIGN KEY ("B") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
