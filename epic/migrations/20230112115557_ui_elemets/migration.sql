-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "key" TEXT NOT NULL DEFAULT '',
    "tooltip" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "jsonValue" JSONB,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Attribute_fields" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Attribute_components" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_key_key" ON "Attribute"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_Attribute_fields_AB_unique" ON "_Attribute_fields"("A", "B");

-- CreateIndex
CREATE INDEX "_Attribute_fields_B_index" ON "_Attribute_fields"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Attribute_components_AB_unique" ON "_Attribute_components"("A", "B");

-- CreateIndex
CREATE INDEX "_Attribute_components_B_index" ON "_Attribute_components"("B");

-- AddForeignKey
ALTER TABLE "_Attribute_fields" ADD CONSTRAINT "_Attribute_fields_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Attribute_fields" ADD CONSTRAINT "_Attribute_fields_B_fkey" FOREIGN KEY ("B") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Attribute_components" ADD CONSTRAINT "_Attribute_components_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Attribute_components" ADD CONSTRAINT "_Attribute_components_B_fkey" FOREIGN KEY ("B") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
