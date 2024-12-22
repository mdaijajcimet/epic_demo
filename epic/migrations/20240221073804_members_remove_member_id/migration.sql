/*
  Warnings:

  - You are about to drop the column `memberId` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Member_memberId_key";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "memberId",
DROP COLUMN "role",
ADD COLUMN     "roles" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");
