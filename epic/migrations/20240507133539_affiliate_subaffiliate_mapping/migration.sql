-------- Copy Creditcard Provider Affiliate Data ----------

CREATE TABLE "_Affiliate_ccProvider" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_Affiliate_ccProvider_AB_unique" ON "_Affiliate_ccProvider"("A", "B");
CREATE INDEX "_Affiliate_ccProvider_B_index" ON "_Affiliate_ccProvider"("B");


INSERT INTO "_Affiliate_ccProvider" ("A", "B") SELECT "A", "B" FROM "_ProviderCreditCard_affiliate";


ALTER TABLE "_ProviderCreditCard_affiliate" DROP CONSTRAINT "_ProviderCreditCard_affiliate_A_fkey";
ALTER TABLE "_ProviderCreditCard_affiliate" DROP CONSTRAINT "_ProviderCreditCard_affiliate_B_fkey";
DROP TABLE "_ProviderCreditCard_affiliate";


ALTER TABLE "_Affiliate_ccProvider" ADD CONSTRAINT "_Affiliate_ccProvider_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_Affiliate_ccProvider" ADD CONSTRAINT "_Affiliate_ccProvider_B_fkey" FOREIGN KEY ("B") REFERENCES "ProviderCreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-------- Copy Creditcard Plan Affiliate Data ----------

CREATE TABLE "_Affiliate_ccPlan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_Affiliate_ccPlan_AB_unique" ON "_Affiliate_ccPlan"("A", "B");
CREATE INDEX "_Affiliate_ccPlan_B_index" ON "_Affiliate_ccPlan"("B");

INSERT INTO "_Affiliate_ccPlan" ("A", "B") SELECT "A", "B" FROM "_CreditCard_affiliate";

ALTER TABLE "_CreditCard_affiliate" DROP CONSTRAINT "_CreditCard_affiliate_A_fkey";
ALTER TABLE "_CreditCard_affiliate" DROP CONSTRAINT "_CreditCard_affiliate_B_fkey";
DROP TABLE "_CreditCard_affiliate";


ALTER TABLE "_Affiliate_ccPlan" ADD CONSTRAINT "_Affiliate_ccPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_Affiliate_ccPlan" ADD CONSTRAINT "_Affiliate_ccPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-------- Copy Personalloan Provider Affiliate Data ----------

CREATE TABLE "_Affiliate_plProvider" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_Affiliate_plProvider_AB_unique" ON "_Affiliate_plProvider"("A", "B");
CREATE INDEX "_Affiliate_plProvider_B_index" ON "_Affiliate_plProvider"("B");

INSERT INTO "_Affiliate_plProvider" ("A", "B") SELECT "A", "B" FROM "_PLProvider_affiliate";

ALTER TABLE "_PLProvider_affiliate" DROP CONSTRAINT "_PLProvider_affiliate_A_fkey";
ALTER TABLE "_PLProvider_affiliate" DROP CONSTRAINT "_PLProvider_affiliate_B_fkey";
DROP TABLE "_PLProvider_affiliate";

ALTER TABLE "_Affiliate_plProvider" ADD CONSTRAINT "_Affiliate_plProvider_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_Affiliate_plProvider" ADD CONSTRAINT "_Affiliate_plProvider_B_fkey" FOREIGN KEY ("B") REFERENCES "PLProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-------- Copy Personalloan Plan Affiliate Data ----------

CREATE TABLE "_Affiliate_plPlan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_Affiliate_plPlan_AB_unique" ON "_Affiliate_plPlan"("A", "B");
CREATE INDEX "_Affiliate_plPlan_B_index" ON "_Affiliate_plPlan"("B");

INSERT INTO "_Affiliate_plPlan" ("A", "B") SELECT "A", "B" FROM "_PersonalLoan_affiliate";

ALTER TABLE "_PersonalLoan_affiliate" DROP CONSTRAINT "_PersonalLoan_affiliate_A_fkey";
ALTER TABLE "_PersonalLoan_affiliate" DROP CONSTRAINT "_PersonalLoan_affiliate_B_fkey";
DROP TABLE "_PersonalLoan_affiliate";

ALTER TABLE "_Affiliate_plPlan" ADD CONSTRAINT "_Affiliate_plPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_Affiliate_plPlan" ADD CONSTRAINT "_Affiliate_plPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "PersonalLoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-------- Copy HealthInsurance Provider Affiliate Data ----------

CREATE TABLE "_Affiliate_hiProvider" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_Affiliate_hiProvider_AB_unique" ON "_Affiliate_hiProvider"("A", "B");
CREATE INDEX "_Affiliate_hiProvider_B_index" ON "_Affiliate_hiProvider"("B");

INSERT INTO "_Affiliate_hiProvider" ("A", "B") SELECT "A", "B" FROM "_HIProvider_affiliate";

ALTER TABLE "_HIProvider_affiliate" DROP CONSTRAINT "_HIProvider_affiliate_A_fkey";
ALTER TABLE "_HIProvider_affiliate" DROP CONSTRAINT "_HIProvider_affiliate_B_fkey";
DROP TABLE "_HIProvider_affiliate";

ALTER TABLE "_Affiliate_hiProvider" ADD CONSTRAINT "_Affiliate_hiProvider_A_fkey" FOREIGN KEY ("A") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_Affiliate_hiProvider" ADD CONSTRAINT "_Affiliate_hiProvider_B_fkey" FOREIGN KEY ("B") REFERENCES "HIProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-------- Add New Column includeAllSubAff -----------------

ALTER TABLE "CreditCard" ADD COLUMN     "includeAllSubAff" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ProviderCreditCard" ADD COLUMN     "includeAllSubAff" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "PLProvider" ADD COLUMN     "includeAllSubAff" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "PersonalLoan" ADD COLUMN     "includeAllSubAff" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "HIProvider" ADD COLUMN     "includeAllSubAff" BOOLEAN NOT NULL DEFAULT true;
