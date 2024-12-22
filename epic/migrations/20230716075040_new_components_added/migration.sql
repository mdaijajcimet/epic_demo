/*
  Warnings:

  - The values [Title,IssuingCountry] on the enum `FormFieldComponentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FormFieldComponentType_new" AS ENUM ('Input', 'CheckBox', 'Select', 'PolymorphicSelect', 'MoreButton', 'DateInput', 'CheckboxButton', 'CheckBoxButtonTabs', 'CheckBoxGroup', 'CheckBoxInput', 'CustomInput', 'DropDownTabs', 'InputWithSlider', 'NameInput', 'RadioButton', 'RadioButtonGroup', 'RadioButtonTabs', 'Slider', 'StyledFileInput', 'StyledInputMask', 'TextArea', 'AddressInput', 'InforBar');
ALTER TABLE "FormField" ALTER COLUMN "component" TYPE "FormFieldComponentType_new" USING ("component"::text::"FormFieldComponentType_new");
ALTER TYPE "FormFieldComponentType" RENAME TO "FormFieldComponentType_old";
ALTER TYPE "FormFieldComponentType_new" RENAME TO "FormFieldComponentType";
DROP TYPE "FormFieldComponentType_old";
COMMIT;
