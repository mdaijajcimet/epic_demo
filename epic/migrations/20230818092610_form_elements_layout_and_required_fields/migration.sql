-- AlterTable
ALTER TABLE "FormComponent" ADD COLUMN     "formGroups" JSONB DEFAULT '[]';

-- AlterTable
ALTER TABLE "FormContainer" ADD COLUMN     "formOrder" JSONB DEFAULT '[]';

-- AlterTable
ALTER TABLE "FormField" ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "requiredMessage" TEXT NOT NULL DEFAULT '';
