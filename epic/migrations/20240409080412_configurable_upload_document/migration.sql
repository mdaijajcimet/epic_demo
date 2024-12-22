-- CreateTable
CREATE TABLE "UploadCategory" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "key" TEXT NOT NULL DEFAULT '',
    "infoText" TEXT NOT NULL DEFAULT '',
    "requiredLength" INTEGER,

    CONSTRAINT "UploadCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadGroup" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "key" TEXT NOT NULL DEFAULT '',
    "vertical" TEXT,
    "order" INTEGER,

    CONSTRAINT "UploadGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadDocument" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "key" TEXT NOT NULL DEFAULT '',
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER,

    CONSTRAINT "UploadDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CreditCard_uploadGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UploadCategory_documents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UploadGroup_categories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "UploadGroup_vertical_idx" ON "UploadGroup"("vertical");

-- CreateIndex
CREATE UNIQUE INDEX "_CreditCard_uploadGroup_AB_unique" ON "_CreditCard_uploadGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_CreditCard_uploadGroup_B_index" ON "_CreditCard_uploadGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UploadCategory_documents_AB_unique" ON "_UploadCategory_documents"("A", "B");

-- CreateIndex
CREATE INDEX "_UploadCategory_documents_B_index" ON "_UploadCategory_documents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UploadGroup_categories_AB_unique" ON "_UploadGroup_categories"("A", "B");

-- CreateIndex
CREATE INDEX "_UploadGroup_categories_B_index" ON "_UploadGroup_categories"("B");

-- AddForeignKey
ALTER TABLE "UploadGroup" ADD CONSTRAINT "UploadGroup_vertical_fkey" FOREIGN KEY ("vertical") REFERENCES "Vertical"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_uploadGroup" ADD CONSTRAINT "_CreditCard_uploadGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_uploadGroup" ADD CONSTRAINT "_CreditCard_uploadGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "UploadGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UploadCategory_documents" ADD CONSTRAINT "_UploadCategory_documents_A_fkey" FOREIGN KEY ("A") REFERENCES "UploadCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UploadCategory_documents" ADD CONSTRAINT "_UploadCategory_documents_B_fkey" FOREIGN KEY ("B") REFERENCES "UploadDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UploadGroup_categories" ADD CONSTRAINT "_UploadGroup_categories_A_fkey" FOREIGN KEY ("A") REFERENCES "UploadCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UploadGroup_categories" ADD CONSTRAINT "_UploadGroup_categories_B_fkey" FOREIGN KEY ("B") REFERENCES "UploadGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
