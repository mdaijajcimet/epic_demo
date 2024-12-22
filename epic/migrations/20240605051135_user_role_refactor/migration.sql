CREATE TABLE "_Role_assignedTo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE UNIQUE INDEX "_Role_assignedTo_AB_unique" ON "_Role_assignedTo"("A", "B");
CREATE INDEX "_Role_assignedTo_B_index" ON "_Role_assignedTo"("B");
ALTER TABLE "_Role_assignedTo" ADD CONSTRAINT "_Role_assignedTo_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_Role_assignedTo" ADD CONSTRAINT "_Role_assignedTo_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "_Role_assignedTo" ("A", "B")
SELECT r."id" AS "A", u."id" AS "B"
FROM "Role" r
INNER JOIN "User" u ON r."id" = u."role";

ALTER TABLE "User" DROP CONSTRAINT "User_role_fkey";
DROP INDEX "User_role_idx";
ALTER TABLE "User" DROP COLUMN "role";

UPDATE
  "Role" AS r
SET
  "role" = COALESCE((
    SELECT
      json_agg(DISTINCT role_arr)
      FROM (
        SELECT
          jsonb_array_elements_text(r."role") AS role_arr
        UNION
        SELECT
          'read'
        WHERE
          r."canManageRoles"
        UNION
        SELECT
          'write'
        WHERE
          r."canManageRoles"
        UNION
        SELECT
          'delete'
        WHERE
          r."canManageRoles") AS subquery), '[]'::json), "user" = COALESCE((
    SELECT
      json_agg(DISTINCT user_arr)
      FROM (
        SELECT
          jsonb_array_elements_text(r."user") AS user_arr
        UNION
        SELECT
          'read'
        WHERE
          r."canSeeOtherPeople"
          OR r."canEditOtherPeople"
          OR r."canManagePeople"
        UNION
        SELECT
          'write'
        WHERE
          r."canEditOtherPeople"
          OR r."canManagePeople"
        UNION
        SELECT
          'delete'
        WHERE
          r."canEditOtherPeople"
          OR r."canManagePeople") AS subquery), '[]'::json), "pages" = COALESCE((
    SELECT
      json_agg(DISTINCT page_arr)
      FROM (
        SELECT
          jsonb_array_elements_text(r."pages") AS page_arr
        UNION
        SELECT
          'read'
        WHERE
          r."canEditPages"
          OR r."canPublishPages"
        UNION
        SELECT
          'write'
        WHERE
          r."canEditPages"
          OR r."canPublishPages"
        UNION
        SELECT
          'delete'
        WHERE
          r."canPublishPages"
        UNION
        SELECT
          'publish'
        WHERE
          r."canPublishPages") AS subquery), '[]'::json);


ALTER TABLE "Role" 
DROP COLUMN "canEditOtherPeople",
DROP COLUMN "canManagePeople",
DROP COLUMN "canManageRoles",
DROP COLUMN "canSeeOtherPeople",
DROP COLUMN "canEditPages",
DROP COLUMN "canPublishPages";


UPDATE "public"."Role"
SET 
    "affiliate" = '["read", "write", "delete"]',
    "auditLog" = '["read", "write", "delete"]',
    "broadband" = '["read", "write", "delete"]',
    "bundle" = '["read", "write", "delete"]',
    "commision" = '["read", "write", "delete"]',
    "creditCards" = '["read", "write", "delete"]',
    "csSite" = '["read", "write", "delete"]',
    "dialerList" = '["read", "write", "delete"]',
    "energy" = '["read", "write", "delete"]',
    "formElements" = '["read", "write", "delete"]',
    "generic" = '["read", "delete", "write"]',
    "healthInsurance" = '["read", "write", "delete"]',
    "ignoreData" = '["read", "write", "delete"]',
    "lms" = '["read", "write", "delete"]',
    "members" = '["read", "write", "delete"]',
    "mirn" = '["read", "write", "delete"]',
    "mobile" = '["read", "write", "delete"]',
    "pages" = '["delete", "publish", "read", "write"]',
    "passwordSetting" = '["read", "write", "delete"]',
    "personalLoan" = '["read", "write", "delete"]',
    "role" = '["delete", "read", "write"]',
    "scripts" = '["read", "write", "delete"]',
    "solar" = '["read", "write", "delete"]',
    "state" = '["read", "write", "delete"]',
    "subAffiliate" = '["read", "write", "delete"]',
    "tariffCode" = '["read", "write", "delete"]',
    "uiElements" = '["read", "write", "delete"]',
    "user" = '["delete", "read", "write"]',
    "vertical" = '["read", "write", "delete"]'
WHERE 
    "name" = 'Super User';
