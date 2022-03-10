/*
  Warnings:

  - The primary key for the `IntermediateCustomerUnavailableCookMethod` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerUnavailableCookMethodId` on the `IntermediateCustomerUnavailableCookMethod` table. All the data in the column will be lost.
  - The primary key for the `IntermediateProductFoodType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerProductFoodTypeId` on the `IntermediateProductFoodType` table. All the data in the column will be lost.
  - You are about to drop the `CustomerProductCookMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerProductFoodType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntermediateCustomerProductFoodType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productCookMethodId` to the `IntermediateCustomerUnavailableCookMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productFoodTypeId` to the `IntermediateProductFoodType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IntermediateCustomerProductFoodType" DROP CONSTRAINT "IntermediateCustomerProductFoodType_customerId_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateCustomerProductFoodType" DROP CONSTRAINT "IntermediateCustomerProductFoodType_customerProductFoodTyp_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateCustomerUnavailableCookMethod" DROP CONSTRAINT "IntermediateCustomerUnavailableCookMethod_customerUnavaila_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateProductCookMethod" DROP CONSTRAINT "IntermediateProductCookMethod_productCookMethodId_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateProductFoodType" DROP CONSTRAINT "IntermediateProductFoodType_customerProductFoodTypeId_fkey";

-- AlterTable
ALTER TABLE "IntermediateCustomerUnavailableCookMethod" DROP CONSTRAINT "IntermediateCustomerUnavailableCookMethod_pkey",
DROP COLUMN "customerUnavailableCookMethodId",
ADD COLUMN     "productCookMethodId" INTEGER NOT NULL,
ADD CONSTRAINT "IntermediateCustomerUnavailableCookMethod_pkey" PRIMARY KEY ("customerId", "productCookMethodId");

-- AlterTable
ALTER TABLE "IntermediateProductFoodType" DROP CONSTRAINT "IntermediateProductFoodType_pkey",
DROP COLUMN "customerProductFoodTypeId",
ADD COLUMN     "productFoodTypeId" INTEGER NOT NULL,
ADD CONSTRAINT "IntermediateProductFoodType_pkey" PRIMARY KEY ("productFoodTypeId", "productId");

-- DropTable
DROP TABLE "CustomerProductCookMethod";

-- DropTable
DROP TABLE "CustomerProductFoodType";

-- DropTable
DROP TABLE "IntermediateCustomerProductFoodType";

-- CreateTable
CREATE TABLE "IntermediateCustomerFoodType" (
    "productFoodTypeId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerFoodType_pkey" PRIMARY KEY ("productFoodTypeId","customerId")
);

-- CreateTable
CREATE TABLE "ProductFoodType" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductFoodType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCookMethod" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductCookMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductFoodType_name_key" ON "ProductFoodType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCookMethod_name_key" ON "ProductCookMethod"("name");

-- AddForeignKey
ALTER TABLE "IntermediateCustomerFoodType" ADD CONSTRAINT "IntermediateCustomerFoodType_productFoodTypeId_fkey" FOREIGN KEY ("productFoodTypeId") REFERENCES "ProductFoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerFoodType" ADD CONSTRAINT "IntermediateCustomerFoodType_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductFoodType" ADD CONSTRAINT "IntermediateProductFoodType_productFoodTypeId_fkey" FOREIGN KEY ("productFoodTypeId") REFERENCES "ProductFoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductCookMethod" ADD CONSTRAINT "IntermediateProductCookMethod_productCookMethodId_fkey" FOREIGN KEY ("productCookMethodId") REFERENCES "ProductCookMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerUnavailableCookMethod" ADD CONSTRAINT "IntermediateCustomerUnavailableCookMethod_productCookMetho_fkey" FOREIGN KEY ("productCookMethodId") REFERENCES "ProductCookMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
