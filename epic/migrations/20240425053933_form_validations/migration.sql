-- AlterTable
ALTER TABLE "FormField" ADD COLUMN "validations" TEXT;

-- CreateTable
CREATE TABLE "FormValidation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT 'string',
    "typeMessage" TEXT NOT NULL DEFAULT '',
    "required" BOOLEAN NOT NULL DEFAULT true,
    "requiredMessage" TEXT NOT NULL DEFAULT '',
    "length" INTEGER,
    "lengthMessage" TEXT NOT NULL DEFAULT '',
    "min" TEXT NOT NULL DEFAULT '',
    "minMessage" TEXT NOT NULL DEFAULT '',
    "max" TEXT NOT NULL DEFAULT '',
    "maxMessage" TEXT NOT NULL DEFAULT '',
    "regEx" TEXT NOT NULL DEFAULT '',
    "regExMessage" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormValidation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormField_validations_key" ON "FormField"("validations");

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_validations_fkey" FOREIGN KEY ("validations") REFERENCES "FormValidation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Iterate through each record in FormField and insert into FormValidations
DO $$
DECLARE
    formfield_record RECORD;
    formvalidation_id VARCHAR(50);
BEGIN
    FOR formfield_record IN SELECT * FROM "FormField" LOOP
        -- Check if formfield_record.required is true
        IF formfield_record.required THEN
            -- Create FormValidation record
            INSERT INTO "FormValidation" ("id", "name","required", "requiredMessage") 
            VALUES (gen_random_uuid(), formfield_record.name || ' - ' || formfield_record.key, formfield_record.required, formfield_record."requiredMessage") 
            RETURNING id INTO formvalidation_id;
            -- Update FormField to set the foreign key reference
            UPDATE "FormField" SET validations = formvalidation_id WHERE id = formfield_record.id;
        END IF;
    END LOOP;
END $$;

-- AlterTable to drop required column once data added in FormValidation
ALTER TABLE "FormField" DROP COLUMN "required",
DROP COLUMN "requiredMessage";
