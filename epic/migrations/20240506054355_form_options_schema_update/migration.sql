-- AlterTable
ALTER TABLE "CCUploadGroup" ALTER COLUMN "key" DROP NOT NULL,
ALTER COLUMN "key" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FormOption" ADD COLUMN     "key" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "UploadCategory" ALTER COLUMN "key" DROP NOT NULL,
ALTER COLUMN "key" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UploadDocument" ALTER COLUMN "key" DROP NOT NULL,
ALTER COLUMN "key" DROP DEFAULT;

-- Iterate through each record in FormOption and add/update key/slug
DO $$
DECLARE
    formoption_record RECORD;
    formoption_slug TEXT;
BEGIN
    FOR formoption_record IN SELECT * FROM "FormOption" LOOP
        IF formoption_record.label = 'Generic: LogoKey' THEN
            formoption_slug := 'generic-logo-key';
        ELSIF formoption_record.label = 'Generic: InputType' THEN
            formoption_slug := 'generic-input-type';
        ELSIF formoption_record.label = 'Generic: Formatter' THEN
            formoption_slug := 'generic-formatter';
        ELSIF formoption_record.label = 'Generic: CountryList' THEN
            formoption_slug := 'generic-country-list';
        ELSIF formoption_record.label = 'PL: LoanPurpose (Detail)' THEN
            formoption_slug := 'pl-loan-purpose-detail';
        ELSE
            formoption_slug := CONCAT(
                LOWER(REGEXP_REPLACE(formoption_record.label, '[^a-zA-Z0-9]+', '-', 'g')),
                '-',
                SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 6)
            );
        END IF;

        -- Update "key" column with the new slug
        UPDATE "FormOption" SET "key" = formoption_slug WHERE id = formoption_record.id;
    END LOOP;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX "FormOption_key_key" ON "FormOption"("key");
