-- AlterTable
ALTER TABLE "Addon" ADD COLUMN     "addonFields" TEXT,
ADD COLUMN     "uuid" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "uuid" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Vertical" ADD COLUMN     "serviceId" INTEGER;

-- CreateTable
CREATE TABLE "AddonField" (
    "id" TEXT NOT NULL,
    "addonId" INTEGER NOT NULL,
    "addonName" TEXT NOT NULL DEFAULT '',
    "category" INTEGER,

    CONSTRAINT "AddonField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AddonField_addonId_key" ON "AddonField"("addonId");

-- CreateIndex
CREATE INDEX "Addon_addonFields_idx" ON "Addon"("addonFields");

-- AddForeignKey
ALTER TABLE "Addon" ADD CONSTRAINT "Addon_addonFields_fkey" FOREIGN KEY ("addonFields") REFERENCES "AddonField"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Update Existing Data
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

UPDATE "public"."Plan" p
SET "uuid" = CONCAT_WS('-', p."planId", COALESCE((SELECT pr."providerId" FROM "public"."Provider" pr WHERE pr."id" = p."provider"), ''));

-- First, insert new records into "AddonField" if necessary and return addonId
WITH new_addon_fields AS (
    INSERT INTO "public"."AddonField" ("id", "addonId", "addonName", "category")
    SELECT uuid_generate_v4()::text, a."addonId", a."addonName", a."category"
    FROM "public"."Addon" AS a
    WHERE a."addonFields" IS NULL
    RETURNING "id", "addonId"
)
-- Then, update "Addon" table with UUIDs and addonFields
UPDATE "public"."Addon" AS a
SET "uuid" = CONCAT_WS('-', a."addonId", a."addonGroup",  a."price", a."isMandatory", a."include"),
    "addonFields" = COALESCE(a."addonFields", CAST(nf."id" AS TEXT))
FROM new_addon_fields AS nf
WHERE nf."addonId" = a."addonId";

-- DropIndex
DROP INDEX "Addon_addonId_key";

-- DropIndex
DROP INDEX "Plan_planId_key";

-- AlterTable
ALTER TABLE "Addon" DROP COLUMN "addonId",
DROP COLUMN "addonName",
DROP COLUMN "category";

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "planId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Addon_uuid_key" ON "Addon"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_uuid_key" ON "Plan"("uuid");

-- CreateTable
CREATE TABLE "_AddonField_scripts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AddonField_scripts_AB_unique" ON "_AddonField_scripts"("A", "B");

-- CreateIndex
CREATE INDEX "_AddonField_scripts_B_index" ON "_AddonField_scripts"("B");

-- AddForeignKey
ALTER TABLE "_AddonField_scripts" ADD CONSTRAINT "_AddonField_scripts_A_fkey" FOREIGN KEY ("A") REFERENCES "AddonField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddonField_scripts" ADD CONSTRAINT "_AddonField_scripts_B_fkey" FOREIGN KEY ("B") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "public"."_AddonField_scripts" ("A", "B")
    Select "addonFields", "B" from "_Addon_scripts" INNER JOIN "Addon" ON "_Addon_scripts"."A" = "Addon"."id";

-- DropForeignKey
ALTER TABLE "_Addon_scripts" DROP CONSTRAINT "_Addon_scripts_A_fkey";

-- DropForeignKey
ALTER TABLE "_Addon_scripts" DROP CONSTRAINT "_Addon_scripts_B_fkey";

-- DropTable
DROP TABLE "_Addon_scripts";

-- AlterTable
ALTER TABLE "Addon" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AddonField" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
