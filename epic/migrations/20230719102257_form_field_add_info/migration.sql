/*
  Warnings:

  - The `component` column on the `FormField` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FormField" ADD COLUMN     "infoText" TEXT NOT NULL DEFAULT '',
DROP COLUMN "component",
ADD COLUMN     "component" TEXT;

-- DropEnum
DROP TYPE "FormFieldComponentType";
