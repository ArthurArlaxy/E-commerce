-- CreateTable
CREATE TABLE "ImageFile" (
    "id" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productImageId" TEXT,
    "categoryId" TEXT,

    CONSTRAINT "ImageFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_productImageId_key" ON "ImageFile"("productImageId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_categoryId_key" ON "ImageFile"("categoryId");

-- AddForeignKey
ALTER TABLE "ImageFile" ADD CONSTRAINT "ImageFile_productImageId_fkey" FOREIGN KEY ("productImageId") REFERENCES "ProductImages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageFile" ADD CONSTRAINT "ImageFile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
