/*
  Warnings:

  - A unique constraint covering the columns `[mainProductImageId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PreservationStyle" AS ENUM ('normal', 'refrigerated', 'frozen');

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "frozenAvailable" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "mainProductImageId" INTEGER,
ADD COLUMN     "preservationStyle" "PreservationStyle" DEFAULT E'normal';

-- CreateIndex
CREATE UNIQUE INDEX "Product_mainProductImageId_key" ON "Product"("mainProductImageId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_mainProductImageId_fkey" FOREIGN KEY ("mainProductImageId") REFERENCES "ProductImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
