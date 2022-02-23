/*
  Warnings:

  - You are about to drop the column `externalId` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalSku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalSku` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productFlavorId_fkey";

-- DropIndex
DROP INDEX "Product_externalId_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "externalId",
ADD COLUMN     "externalSku" TEXT NOT NULL,
ALTER COLUMN "productFlavorId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_externalSku_key" ON "Product"("externalSku");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productFlavorId_fkey" FOREIGN KEY ("productFlavorId") REFERENCES "ProductFlavor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
