-- CreateTable
CREATE TABLE "CustomAttribute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "attribute" TEXT,
    "headerTooltip" TEXT NOT NULL DEFAULT '',
    "infoTooltip" TEXT NOT NULL DEFAULT '',
    "formatter" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CustomAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CreditCard_customConfig" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "CustomAttribute_attribute_idx" ON "CustomAttribute"("attribute");

-- CreateIndex
CREATE UNIQUE INDEX "_CreditCard_customConfig_AB_unique" ON "_CreditCard_customConfig"("A", "B");

-- CreateIndex
CREATE INDEX "_CreditCard_customConfig_B_index" ON "_CreditCard_customConfig"("B");

-- AddForeignKey
ALTER TABLE "CustomAttribute" ADD CONSTRAINT "CustomAttribute_attribute_fkey" FOREIGN KEY ("attribute") REFERENCES "Attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_customConfig" ADD CONSTRAINT "_CreditCard_customConfig_A_fkey" FOREIGN KEY ("A") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_customConfig" ADD CONSTRAINT "_CreditCard_customConfig_B_fkey" FOREIGN KEY ("B") REFERENCES "CustomAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
