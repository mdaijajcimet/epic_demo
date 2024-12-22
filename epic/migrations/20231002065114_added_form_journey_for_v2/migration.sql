-- CreateTable
CREATE TABLE "FormJourney" (
    "id" TEXT NOT NULL,
    "v2" BOOLEAN NOT NULL DEFAULT false,
    "steps" JSONB DEFAULT '[]',

    CONSTRAINT "FormJourney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FormJourney_provider" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FormJourney_provider_AB_unique" ON "_FormJourney_provider"("A", "B");

-- CreateIndex
CREATE INDEX "_FormJourney_provider_B_index" ON "_FormJourney_provider"("B");

-- AddForeignKey
ALTER TABLE "_FormJourney_provider" ADD CONSTRAINT "_FormJourney_provider_A_fkey" FOREIGN KEY ("A") REFERENCES "FormJourney"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormJourney_provider" ADD CONSTRAINT "_FormJourney_provider_B_fkey" FOREIGN KEY ("B") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
