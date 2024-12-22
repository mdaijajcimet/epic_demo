-- Existing position
UPDATE "Script" SET "position" = NULL;

-- AlterEnum
BEGIN;
CREATE TYPE "ScriptPositionType_new" AS ENUM ('top', 'bottom');
ALTER TABLE "Script" ALTER COLUMN "position" DROP DEFAULT;
ALTER TABLE "Script" ALTER COLUMN "position" TYPE "ScriptPositionType_new" USING ("position"::text::"ScriptPositionType_new");
ALTER TYPE "ScriptPositionType" RENAME TO "ScriptPositionType_old";
ALTER TYPE "ScriptPositionType_new" RENAME TO "ScriptPositionType";
DROP TYPE "ScriptPositionType_old";
ALTER TABLE "Script" ALTER COLUMN "position" SET DEFAULT 'top';
COMMIT;

-- AlterTable
UPDATE "Script" SET "position" = 'top';
