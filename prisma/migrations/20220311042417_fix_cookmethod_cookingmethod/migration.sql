/*
  Warnings:

  - You are about to drop the `IntermediateCustomerUnavailableCookMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntermediateProductCookMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductCookMethod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IntermediateCustomerUnavailableCookMethod" DROP CONSTRAINT "IntermediateCustomerUnavailableCookMethod_customerId_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateCustomerUnavailableCookMethod" DROP CONSTRAINT "IntermediateCustomerUnavailableCookMethod_productCookMetho_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateProductCookMethod" DROP CONSTRAINT "IntermediateProductCookMethod_productCookMethodId_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateProductCookMethod" DROP CONSTRAINT "IntermediateProductCookMethod_productId_fkey";

-- DropTable
DROP TABLE "IntermediateCustomerUnavailableCookMethod";

-- DropTable
DROP TABLE "IntermediateProductCookMethod";

-- DropTable
DROP TABLE "ProductCookMethod";

-- CreateTable
CREATE TABLE "IntermediateProductCookingMethod" (
    "productId" INTEGER NOT NULL,
    "productCookingMethodId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateProductCookingMethod_pkey" PRIMARY KEY ("productId","productCookingMethodId")
);

-- CreateTable
CREATE TABLE "IntermediateCustomerUnavailableCookingMethod" (
    "customerId" INTEGER NOT NULL,
    "productCookingMethodId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerUnavailableCookingMethod_pkey" PRIMARY KEY ("customerId","productCookingMethodId")
);

-- CreateTable
CREATE TABLE "ProductCookingMethod" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductCookingMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCookingMethod_name_key" ON "ProductCookingMethod"("name");

-- AddForeignKey
ALTER TABLE "IntermediateProductCookingMethod" ADD CONSTRAINT "IntermediateProductCookingMethod_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductCookingMethod" ADD CONSTRAINT "IntermediateProductCookingMethod_productCookingMethodId_fkey" FOREIGN KEY ("productCookingMethodId") REFERENCES "ProductCookingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerUnavailableCookingMethod" ADD CONSTRAINT "IntermediateCustomerUnavailableCookingMethod_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerUnavailableCookingMethod" ADD CONSTRAINT "IntermediateCustomerUnavailableCookingMethod_productCookin_fkey" FOREIGN KEY ("productCookingMethodId") REFERENCES "ProductCookingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
