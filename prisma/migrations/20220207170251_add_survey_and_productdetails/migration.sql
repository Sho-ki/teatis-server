/*
  Warnings:

  - You are about to drop the column `created_at` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `external_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `product_povider_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `upc_code` on the `Product` table. All the data in the column will be lost.
  - Added the required column `externalId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productFlavorId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productPoviderId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Texure" AS ENUM ('soft', 'medium', 'hard');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "created_at",
DROP COLUMN "external_id",
DROP COLUMN "product_povider_id",
DROP COLUMN "upc_code",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "externalId" INTEGER NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "productFlavorId" INTEGER NOT NULL,
ADD COLUMN     "productPoviderId" INTEGER NOT NULL,
ADD COLUMN     "upcCode" INTEGER;

-- CreateTable
CREATE TABLE "IntermediateCustomerMedicalCondition" (
    "medicalConditionValue" TEXT NOT NULL,
    "customerMedicalConditionId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerMedicalCondition_pkey" PRIMARY KEY ("customerMedicalConditionId","customerId")
);

-- CreateTable
CREATE TABLE "CustomerMedicalCondition" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerMedicalCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFlavor" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductFlavor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediateProductCategory" (
    "productId" INTEGER NOT NULL,
    "productCategoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateProductCategory_pkey" PRIMARY KEY ("productId","productCategoryId")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediateProductIngredient" (
    "productId" INTEGER NOT NULL,
    "productIngredientId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateProductIngredient_pkey" PRIMARY KEY ("productId","productIngredientId")
);

-- CreateTable
CREATE TABLE "ProductIngredient" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediateProductAllergen" (
    "productId" INTEGER NOT NULL,
    "productAllergenId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateProductAllergen_pkey" PRIMARY KEY ("productId","productAllergenId")
);

-- CreateTable
CREATE TABLE "ProductAllergen" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductAllergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediateCustomerAllergen" (
    "customerId" INTEGER NOT NULL,
    "productAllergenId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateCustomerAllergen_pkey" PRIMARY KEY ("customerId","productAllergenId")
);

-- CreateTable
CREATE TABLE "ProductNutritionFact" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER,
    "servingSize" INTEGER,
    "calories" INTEGER,
    "totalFatG" INTEGER,
    "saturatedFatG" INTEGER,
    "transFatG" INTEGER,
    "cholesteroleMg" INTEGER,
    "sodiumMg" INTEGER,
    "totalCarbohydrateG" INTEGER,
    "dietaryFiberG" INTEGER,
    "totalSugarG" INTEGER,
    "addedSugarG" INTEGER,
    "proteinG" INTEGER,
    "sweet" INTEGER,
    "sour" INTEGER,
    "salty" INTEGER,
    "bitter" INTEGER,
    "spicy" INTEGER,
    "texture" "Texure" NOT NULL DEFAULT E'medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductNutritionFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPovider" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductPovider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediateSurveyQuestion" (
    "surveyId" INTEGER NOT NULL,
    "surveyQuestionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateSurveyQuestion_pkey" PRIMARY KEY ("surveyId","surveyQuestionId")
);

-- CreateTable
CREATE TABLE "SurveyQuestion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "questionCategoryId" INTEGER NOT NULL,
    "mustBeAnswered" BOOLEAN NOT NULL,
    "instruction" TEXT,
    "placeholder" TEXT,
    "surveyQuestionAnswerTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionCategory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyQuestionAnswerType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyQuestionAnswerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyQuestionOption" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "surveyQuestionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyQuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyQuestionAnswerServiceFeedback" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "surveyQuestionId" INTEGER NOT NULL,
    "answerOptionId" INTEGER,
    "answerNumeric" INTEGER,
    "answerText" TEXT,
    "answerBool" BOOLEAN,
    "reason" TEXT,
    "answerCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyQuestionAnswerServiceFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyQuestionAnswerProductFeedback" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "reason" TEXT,
    "answerCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyQuestionAnswerProductFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerProductDistance" (
    "id" SERIAL NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "surveyQuestionAnswerProductFeedbackId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerProductDistance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerMedicalCondition_label_key" ON "CustomerMedicalCondition"("label");

-- CreateIndex
CREATE UNIQUE INDEX "ProductNutritionFact_productId_key" ON "ProductNutritionFact"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPovider_provider_key" ON "ProductPovider"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProductDistance_surveyQuestionAnswerProductFeedback_key" ON "CustomerProductDistance"("surveyQuestionAnswerProductFeedbackId");

-- AddForeignKey
ALTER TABLE "IntermediateCustomerMedicalCondition" ADD CONSTRAINT "IntermediateCustomerMedicalCondition_customerMedicalCondit_fkey" FOREIGN KEY ("customerMedicalConditionId") REFERENCES "CustomerMedicalCondition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerMedicalCondition" ADD CONSTRAINT "IntermediateCustomerMedicalCondition_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productPoviderId_fkey" FOREIGN KEY ("productPoviderId") REFERENCES "ProductPovider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productFlavorId_fkey" FOREIGN KEY ("productFlavorId") REFERENCES "ProductFlavor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductCategory" ADD CONSTRAINT "IntermediateProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductCategory" ADD CONSTRAINT "IntermediateProductCategory_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductIngredient" ADD CONSTRAINT "IntermediateProductIngredient_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductIngredient" ADD CONSTRAINT "IntermediateProductIngredient_productIngredientId_fkey" FOREIGN KEY ("productIngredientId") REFERENCES "ProductIngredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductAllergen" ADD CONSTRAINT "IntermediateProductAllergen_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductAllergen" ADD CONSTRAINT "IntermediateProductAllergen_productAllergenId_fkey" FOREIGN KEY ("productAllergenId") REFERENCES "ProductAllergen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerAllergen" ADD CONSTRAINT "IntermediateCustomerAllergen_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateCustomerAllergen" ADD CONSTRAINT "IntermediateCustomerAllergen_productAllergenId_fkey" FOREIGN KEY ("productAllergenId") REFERENCES "ProductAllergen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductNutritionFact" ADD CONSTRAINT "ProductNutritionFact_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateSurveyQuestion" ADD CONSTRAINT "IntermediateSurveyQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateSurveyQuestion" ADD CONSTRAINT "IntermediateSurveyQuestion_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "SurveyQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestion" ADD CONSTRAINT "SurveyQuestion_questionCategoryId_fkey" FOREIGN KEY ("questionCategoryId") REFERENCES "QuestionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestion" ADD CONSTRAINT "SurveyQuestion_surveyQuestionAnswerTypeId_fkey" FOREIGN KEY ("surveyQuestionAnswerTypeId") REFERENCES "SurveyQuestionAnswerType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionOption" ADD CONSTRAINT "SurveyQuestionOption_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "SurveyQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" ADD CONSTRAINT "SurveyQuestionAnswerServiceFeedback_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" ADD CONSTRAINT "SurveyQuestionAnswerServiceFeedback_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "SurveyQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" ADD CONSTRAINT "SurveyQuestionAnswerServiceFeedback_answerOptionId_fkey" FOREIGN KEY ("answerOptionId") REFERENCES "SurveyQuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswerProductFeedback" ADD CONSTRAINT "SurveyQuestionAnswerProductFeedback_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswerProductFeedback" ADD CONSTRAINT "SurveyQuestionAnswerProductFeedback_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProductDistance" ADD CONSTRAINT "CustomerProductDistance_surveyQuestionAnswerProductFeedbac_fkey" FOREIGN KEY ("surveyQuestionAnswerProductFeedbackId") REFERENCES "SurveyQuestionAnswerProductFeedback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
