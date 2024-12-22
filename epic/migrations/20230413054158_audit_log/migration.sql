-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT '',
    "collectionName" TEXT NOT NULL DEFAULT '',
    "docId" TEXT NOT NULL DEFAULT '',
    "attributeName" TEXT NOT NULL DEFAULT '',
    "actionType" TEXT NOT NULL DEFAULT '',
    "oldValue" TEXT NOT NULL DEFAULT '',
    "newValue" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
