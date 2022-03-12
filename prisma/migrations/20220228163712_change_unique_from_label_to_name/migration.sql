/*
  Warnings:

  - You are about to drop the column `description` on the `CustomerMedicalCondition` table. All the data in the column will be lost.
  - You are about to drop the `IntermediateProductCategory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `CustomerMedicalCondition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `CustomerProductFoodType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ProductAllergen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ProductFlavor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ProductIngredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `QuestionCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `SurveyQuestionAnswerType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `CustomerMedicalCondition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CustomerProductFoodType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ProductAllergen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ProductFlavor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ProductIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `QuestionCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SurveyQuestionAnswerType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IntermediateProductCategory" DROP CONSTRAINT "IntermediateProductCategory_productCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateProductCategory" DROP CONSTRAINT "IntermediateProductCategory_productId_fkey";

-- DropIndex
DROP INDEX "CustomerMedicalCondition_label_key";

-- DropIndex
DROP INDEX "CustomerProductFoodType_label_key";

-- DropIndex
DROP INDEX "ProductAllergen_label_key";

-- DropIndex
DROP INDEX "ProductCategory_label_key";

-- DropIndex
DROP INDEX "ProductFlavor_label_key";

-- DropIndex
DROP INDEX "ProductIngredient_label_key";

-- DropIndex
DROP INDEX "QuestionCategory_label_key";

-- DropIndex
DROP INDEX "SurveyQuestionAnswerType_label_key";

-- AlterTable
ALTER TABLE "CustomerMedicalCondition" DROP COLUMN "description",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CustomerProductFoodType" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productCategoryId" INTEGER;

-- AlterTable
ALTER TABLE "ProductAllergen" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductFlavor" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductIngredient" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuestionCategory" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SurveyQuestionAnswerType" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "IntermediateProductCategory";

-- CreateTable
CREATE TABLE "IntermediateProductCookMethod" (
    "productId" INTEGER NOT NULL,
    "productCookMethodId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateProductCookMethod_pkey" PRIMARY KEY ("productId","productCookMethodId")
);

-- CreateTable
CREATE TABLE "IntermediateCustomerUnavailableCookMethod" (
    "customerId" INTEGER NOT NULL,
    "customerUnavailableCookMethodId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerUnavailableCookMethod_pkey" PRIMARY KEY ("customerId","customerUnavailableCookMethodId")
);

-- CreateTable
CREATE TABLE "CustomerProductCookMethod" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerProductCookMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProductCookMethod_name_key" ON "CustomerProductCookMethod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerMedicalCondition_name_key" ON "CustomerMedicalCondition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProductFoodType_name_key" ON "CustomerProductFoodType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAllergen_name_key" ON "ProductAllergen"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductFlavor_name_key" ON "ProductFlavor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductIngredient_name_key" ON "ProductIngredient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionCategory_name_key" ON "QuestionCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionAnswerType_name_key" ON "SurveyQuestionAnswerType"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductCookMethod" ADD CONSTRAINT "IntermediateProductCookMethod_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductCookMethod" ADD CONSTRAINT "IntermediateProductCookMethod_productCookMethodId_fkey" FOREIGN KEY ("productCookMethodId") REFERENCES "CustomerProductCookMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerUnavailableCookMethod" ADD CONSTRAINT "IntermediateCustomerUnavailableCookMethod_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerUnavailableCookMethod" ADD CONSTRAINT "IntermediateCustomerUnavailableCookMethod_customerUnavaila_fkey" FOREIGN KEY ("customerUnavailableCookMethodId") REFERENCES "CustomerProductCookMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
