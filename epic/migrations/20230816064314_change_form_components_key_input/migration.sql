/*
  Warnings:

  - Made the column `key` on table `FormComponent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FormComponent" ALTER COLUMN "key" SET NOT NULL,
ALTER COLUMN "key" SET DEFAULT '';
