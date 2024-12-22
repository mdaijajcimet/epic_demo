/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_image_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_heroImage_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_thumbnail_fkey";

-- DropForeignKey
ALTER TABLE "Vertical" DROP CONSTRAINT "Vertical_icon_fkey";

-- DropForeignKey
ALTER TABLE "_CreditCard_document" DROP CONSTRAINT "_CreditCard_document_B_fkey";

-- DropForeignKey
ALTER TABLE "_RewardProgram_icons" DROP CONSTRAINT "_RewardProgram_icons_A_fkey";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "Image";

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "file_filesize" INTEGER,
    "file_filename" TEXT,
    "altText" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_thumbnail_fkey" FOREIGN KEY ("thumbnail") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_heroImage_fkey" FOREIGN KEY ("heroImage") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vertical" ADD CONSTRAINT "Vertical_icon_fkey" FOREIGN KEY ("icon") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_image_fkey" FOREIGN KEY ("image") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RewardProgram_icons" ADD CONSTRAINT "_RewardProgram_icons_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditCard_document" ADD CONSTRAINT "_CreditCard_document_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
