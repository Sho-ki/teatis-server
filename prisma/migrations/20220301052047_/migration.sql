/*
  Warnings:

  - You are about to drop the `ProductPovider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productProviderId_fkey";

-- DropTable
DROP TABLE "ProductPovider";

-- CreateTable
CREATE TABLE "ProductProvider" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductProvider_provider_key" ON "ProductProvider"("provider");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productProviderId_fkey" FOREIGN KEY ("productProviderId") REFERENCES "ProductProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
