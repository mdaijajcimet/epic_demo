-- AlterTable
ALTER TABLE "Eligibility" ADD COLUMN     "visaValidity" INTEGER;

UPDATE "Eligibility"
SET residency = (
    SELECT jsonb_agg(
        CASE 
            WHEN value::text = '"permanent_resident"' THEN '"permanentResident"'
            WHEN value::text = '"temp_visa_12"' THEN '"visaHolder"'
            ELSE value
        END
    )
    FROM jsonb_array_elements(residency) AS value
    WHERE value::text NOT IN ('"business_visa"', '"457_visa"')
)
WHERE residency @> ANY(ARRAY['["business_visa"]', '["457_visa"]', '["temp_visa_12"]', '["permanent_resident"]']::jsonb[]) OR residency IS NULL;
