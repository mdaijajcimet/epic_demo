
ALTER TABLE "UploadGroup" DROP CONSTRAINT "UploadGroup_vertical_fkey";
ALTER TABLE "_CreditCard_uploadGroup" DROP CONSTRAINT "_CreditCard_uploadGroup_A_fkey";
ALTER TABLE "_CreditCard_uploadGroup" DROP CONSTRAINT "_CreditCard_uploadGroup_B_fkey";
ALTER TABLE "_UploadGroup_categories" DROP CONSTRAINT "_UploadGroup_categories_A_fkey";
ALTER TABLE "_UploadGroup_categories" DROP CONSTRAINT "_UploadGroup_categories_B_fkey";

DROP TABLE "UploadGroup";
DROP TABLE "_CreditCard_uploadGroup";
DROP TABLE "_UploadGroup_categories";

CREATE TABLE "CCUploadGroup" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "key" TEXT NOT NULL DEFAULT '',
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CCUploadGroup_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_CCUploadGroup_provider" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE TABLE "_CCUploadGroup_creditCard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE TABLE "_CCUploadGroup_categories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_CCUploadGroup_provider_AB_unique" ON "_CCUploadGroup_provider"("A", "B");
CREATE INDEX "_CCUploadGroup_provider_B_index" ON "_CCUploadGroup_provider"("B");
CREATE UNIQUE INDEX "_CCUploadGroup_creditCard_AB_unique" ON "_CCUploadGroup_creditCard"("A", "B");
CREATE INDEX "_CCUploadGroup_creditCard_B_index" ON "_CCUploadGroup_creditCard"("B");
CREATE UNIQUE INDEX "_CCUploadGroup_categories_AB_unique" ON "_CCUploadGroup_categories"("A", "B");
CREATE INDEX "_CCUploadGroup_categories_B_index" ON "_CCUploadGroup_categories"("B");

ALTER TABLE "_CCUploadGroup_provider" ADD CONSTRAINT "_CCUploadGroup_provider_A_fkey" FOREIGN KEY ("A") REFERENCES "CCUploadGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCUploadGroup_provider" ADD CONSTRAINT "_CCUploadGroup_provider_B_fkey" FOREIGN KEY ("B") REFERENCES "ProviderCreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCUploadGroup_creditCard" ADD CONSTRAINT "_CCUploadGroup_creditCard_A_fkey" FOREIGN KEY ("A") REFERENCES "CCUploadGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCUploadGroup_creditCard" ADD CONSTRAINT "_CCUploadGroup_creditCard_B_fkey" FOREIGN KEY ("B") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCUploadGroup_categories" ADD CONSTRAINT "_CCUploadGroup_categories_A_fkey" FOREIGN KEY ("A") REFERENCES "CCUploadGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CCUploadGroup_categories" ADD CONSTRAINT "_CCUploadGroup_categories_B_fkey" FOREIGN KEY ("B") REFERENCES "UploadCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
