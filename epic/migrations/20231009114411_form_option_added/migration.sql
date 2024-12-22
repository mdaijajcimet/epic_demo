-- CreateTable
CREATE TABLE "FormOption" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "options" JSONB DEFAULT '[{"label":"LABEL","value":"VALUE"}]',

    CONSTRAINT "FormOption_pkey" PRIMARY KEY ("id")
);
