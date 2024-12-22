
ALTER TABLE "FormContainer" DROP CONSTRAINT "FormContainer_vertical_fkey";
ALTER TABLE "_FormContainer_affiliate" DROP CONSTRAINT "_FormContainer_affiliate_A_fkey";
ALTER TABLE "_FormContainer_affiliate" DROP CONSTRAINT "_FormContainer_affiliate_B_fkey";
ALTER TABLE "_FormContainer_formComponents" DROP CONSTRAINT "_FormContainer_formComponents_A_fkey";
ALTER TABLE "_FormContainer_formComponents" DROP CONSTRAINT "_FormContainer_formComponents_B_fkey";
ALTER TABLE "_FormContainer_provider" DROP CONSTRAINT "_FormContainer_provider_A_fkey";
ALTER TABLE "_FormContainer_provider" DROP CONSTRAINT "_FormContainer_provider_B_fkey";
ALTER TABLE "_FormContainer_scripts" DROP CONSTRAINT "_FormContainer_scripts_A_fkey";
ALTER TABLE "_FormContainer_scripts" DROP CONSTRAINT "_FormContainer_scripts_B_fkey";
ALTER TABLE "_FormContainer_subAffiliate" DROP CONSTRAINT "_FormContainer_subAffiliate_A_fkey";
ALTER TABLE "_FormContainer_subAffiliate" DROP CONSTRAINT "_FormContainer_subAffiliate_B_fkey";

DROP TABLE "FormContainer";
DROP TABLE "_FormContainer_affiliate";
DROP TABLE "_FormContainer_formComponents";
DROP TABLE "_FormContainer_provider";
DROP TABLE "_FormContainer_scripts";
DROP TABLE "_FormContainer_subAffiliate";