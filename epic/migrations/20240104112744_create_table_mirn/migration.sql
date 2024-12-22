-- CreateTable
CREATE TABLE "Mirn" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL DEFAULT '',
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mirn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mirn_fileName_key" ON "Mirn"("fileName");
