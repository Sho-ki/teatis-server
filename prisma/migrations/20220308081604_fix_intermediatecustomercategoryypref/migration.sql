/*
  Warnings:

  - You are about to drop the `IntermediateCustomerCategoryRank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IntermediateCustomerCategoryRank" DROP CONSTRAINT "IntermediateCustomerCategoryRank_customerId_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateCustomerCategoryRank" DROP CONSTRAINT "IntermediateCustomerCategoryRank_productCategoryId_fkey";

-- DropTable
DROP TABLE "IntermediateCustomerCategoryRank";

-- CreateTable
CREATE TABLE "IntermediateCustomerCategoryPreference" (
    "productCategoryId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "rank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerCategoryPreference_pkey" PRIMARY KEY ("productCategoryId","customerId")
);

-- AddForeignKey
ALTER TABLE "IntermediateCustomerCategoryPreference" ADD CONSTRAINT "IntermediateCustomerCategoryPreference_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerCategoryPreference" ADD CONSTRAINT "IntermediateCustomerCategoryPreference_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
