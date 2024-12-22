-- Set Null values to 1
UPDATE "UploadCategory"
SET "requiredLength" = 1
WHERE "requiredLength" is NULL;

-- AlterTable
ALTER TABLE "UploadCategory" ALTER COLUMN "requiredLength" SET NOT NULL,
ALTER COLUMN "requiredLength" SET DEFAULT 1;
