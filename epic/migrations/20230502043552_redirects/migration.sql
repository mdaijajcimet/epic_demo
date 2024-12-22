-- CreateTable
CREATE TABLE "Redirect" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL DEFAULT '',
    "to" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Domain_redirects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Domain_redirects_AB_unique" ON "_Domain_redirects"("A", "B");

-- CreateIndex
CREATE INDEX "_Domain_redirects_B_index" ON "_Domain_redirects"("B");

-- AddForeignKey
ALTER TABLE "_Domain_redirects" ADD CONSTRAINT "_Domain_redirects_A_fkey" FOREIGN KEY ("A") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Domain_redirects" ADD CONSTRAINT "_Domain_redirects_B_fkey" FOREIGN KEY ("B") REFERENCES "Redirect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
