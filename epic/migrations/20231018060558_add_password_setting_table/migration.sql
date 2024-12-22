-- CreateTable
CREATE TABLE "PasswordSetting" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "enableEmailLogs" BOOLEAN NOT NULL DEFAULT true,
    "logEmails" TEXT NOT NULL DEFAULT '',
    "allowedIps" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "PasswordSetting_pkey" PRIMARY KEY ("id")
);
