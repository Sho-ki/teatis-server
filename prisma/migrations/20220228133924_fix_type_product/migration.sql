/*
  Warnings:

  - You are about to drop the column `productPoviderId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productProviderId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productPoviderId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productPoviderId",
ADD COLUMN     "productProviderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productProviderId_fkey" FOREIGN KEY ("productProviderId") REFERENCES "ProductPovider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
