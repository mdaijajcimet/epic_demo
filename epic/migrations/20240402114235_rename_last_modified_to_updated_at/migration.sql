/*
  Warnings:

  - You are about to drop the column `lastModified` on the `Domain` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `PageConfig` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `Redirect` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `RetailerMatrix` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `Widget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "lastModified",
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "lastModified",
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PageConfig" DROP COLUMN "lastModified",
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Redirect" DROP COLUMN "lastModified",
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RetailerMatrix" DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "lastModified",
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Widget" DROP COLUMN "lastModified",
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
