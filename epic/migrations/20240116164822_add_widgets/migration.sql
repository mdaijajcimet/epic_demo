-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Page_widgets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Widget_slug_key" ON "Widget"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_Page_widgets_AB_unique" ON "_Page_widgets"("A", "B");

-- CreateIndex
CREATE INDEX "_Page_widgets_B_index" ON "_Page_widgets"("B");

-- AddForeignKey
ALTER TABLE "_Page_widgets" ADD CONSTRAINT "_Page_widgets_A_fkey" FOREIGN KEY ("A") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Page_widgets" ADD CONSTRAINT "_Page_widgets_B_fkey" FOREIGN KEY ("B") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
