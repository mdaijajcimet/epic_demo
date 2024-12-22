-- CreateTable
CREATE TABLE "Filter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "placeholder" TEXT NOT NULL DEFAULT '',
    "formatter" BOOLEAN NOT NULL DEFAULT false,
    "aggregate" BOOLEAN NOT NULL DEFAULT false,
    "min" INTEGER,
    "max" INTEGER,
    "value" TEXT NOT NULL DEFAULT '',
    "collapsed" BOOLEAN NOT NULL DEFAULT false,
    "attribute" TEXT,
    "vertical" TEXT,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Filter_elements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Filter_pages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Filter_attribute_idx" ON "Filter"("attribute");

-- CreateIndex
CREATE INDEX "Filter_vertical_idx" ON "Filter"("vertical");

-- CreateIndex
CREATE UNIQUE INDEX "_Filter_elements_AB_unique" ON "_Filter_elements"("A", "B");

-- CreateIndex
CREATE INDEX "_Filter_elements_B_index" ON "_Filter_elements"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Filter_pages_AB_unique" ON "_Filter_pages"("A", "B");

-- CreateIndex
CREATE INDEX "_Filter_pages_B_index" ON "_Filter_pages"("B");

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_attribute_fkey" FOREIGN KEY ("attribute") REFERENCES "Attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_vertical_fkey" FOREIGN KEY ("vertical") REFERENCES "Vertical"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Filter_elements" ADD CONSTRAINT "_Filter_elements_A_fkey" FOREIGN KEY ("A") REFERENCES "Filter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Filter_elements" ADD CONSTRAINT "_Filter_elements_B_fkey" FOREIGN KEY ("B") REFERENCES "Filter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Filter_pages" ADD CONSTRAINT "_Filter_pages_A_fkey" FOREIGN KEY ("A") REFERENCES "Filter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Filter_pages" ADD CONSTRAINT "_Filter_pages_B_fkey" FOREIGN KEY ("B") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
