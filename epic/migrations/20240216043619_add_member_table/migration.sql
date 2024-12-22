-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_memberId_key" ON "Member"("memberId");
