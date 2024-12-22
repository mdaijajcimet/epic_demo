-- CreateTable
CREATE TABLE "DialerList" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "DialerList_pkey" PRIMARY KEY ("id")
);
