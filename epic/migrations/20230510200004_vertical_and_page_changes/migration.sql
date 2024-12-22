-- DropIndex
DROP INDEX "Page_slug_key";

-- DropIndex
DROP INDEX "Page_vertical_key";

-- CreateIndex
CREATE INDEX "Page_vertical_idx" ON "Page"("vertical");
