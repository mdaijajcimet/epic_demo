-- CreateTable
CREATE TABLE "HIRebate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "ageGroup" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "rebate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HIRebate_pkey" PRIMARY KEY ("id")
);
