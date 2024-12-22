-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "domain" TEXT;

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "hostname" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Page_domain_idx" ON "Page"("domain");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_domain_fkey" FOREIGN KEY ("domain") REFERENCES "Domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
