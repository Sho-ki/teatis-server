/*
  Warnings:

  - You are about to drop the column `surveyQuestionAnswerProductFeedbackId` on the `CustomerProductDistance` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `SurveyQuestionAnswerProductFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `answerOptionId` on the `SurveyQuestionAnswerServiceFeedback` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId,surveyQuestionId,shopifyOrderId]` on the table `SurveyQuestionAnswerProductFeedback` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId,surveyQuestionId,shopifyOrderId]` on the table `SurveyQuestionAnswerServiceFeedback` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `CustomerProductDistance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `CustomerProductDistance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopifyOrderId` to the `SurveyQuestionAnswerProductFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surveyQuestionId` to the `SurveyQuestionAnswerProductFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopifyOrderId` to the `SurveyQuestionAnswerServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('queue', 'complete');

-- DropForeignKey
ALTER TABLE "CustomerProductDistance" DROP CONSTRAINT "CustomerProductDistance_surveyQuestionAnswerProductFeedbac_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" DROP CONSTRAINT "SurveyQuestionAnswerServiceFeedback_answerOptionId_fkey";

-- DropIndex
DROP INDEX "CustomerProductDistance_surveyQuestionAnswerProductFeedback_key";

-- AlterTable
ALTER TABLE "CustomerProductDistance" DROP COLUMN "surveyQuestionAnswerProductFeedbackId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "version" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SurveyQuestionAnswerProductFeedback" DROP COLUMN "score",
ADD COLUMN     "answerBool" BOOLEAN,
ADD COLUMN     "answerNumeric" INTEGER,
ADD COLUMN     "answerSingleOptionId" INTEGER,
ADD COLUMN     "answerText" TEXT,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "shopifyOrderId" INTEGER NOT NULL,
ADD COLUMN     "surveyQuestionId" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" DROP COLUMN "answerOptionId",
ADD COLUMN     "answerSingleOptionId" INTEGER,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "shopifyOrderId" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "IntermediateSurveyQuestionAnswerService" (
    "surveyQuestionAnswerServiceFeedbackId" INTEGER NOT NULL,
    "surveyQuestionOptionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateSurveyQuestionAnswerService_pkey" PRIMARY KEY ("surveyQuestionAnswerServiceFeedbackId","surveyQuestionOptionId")
);

-- CreateTable
CREATE TABLE "IntermediateSurveyQuestionAnswerProduct" (
    "surveyQuestionAnswerProductFeedbackId" INTEGER NOT NULL,
    "surveyQuestionOptionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateSurveyQuestionAnswerProduct_pkey" PRIMARY KEY ("surveyQuestionAnswerProductFeedbackId","surveyQuestionOptionId")
);

-- CreateTable
CREATE TABLE "CustomerBoxItems" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerBoxItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueuedShopifyOrder" (
    "id" SERIAL NOT NULL,
    "orderName" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "scheduledAt" TEXT NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT E'queue',
    "completedAt" TEXT,

    CONSTRAINT "QueuedShopifyOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QueuedShopifyOrder_orderName_key" ON "QueuedShopifyOrder"("orderName");

-- CreateIndex
CREATE UNIQUE INDEX "Product_externalId_key" ON "Product"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionAnswerProductFeedback_customerId_surveyQuesti_key" ON "SurveyQuestionAnswerProductFeedback"("customerId", "surveyQuestionId", "shopifyOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionAnswerServiceFeedback_customerId_surveyQuesti_key" ON "SurveyQuestionAnswerServiceFeedback"("customerId", "surveyQuestionId", "shopifyOrderId");

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" ADD CONSTRAINT "SurveyQuestionAnswerServiceFeedback_answerSingleOptionId_fkey" FOREIGN KEY ("answerSingleOptionId") REFERENCES "SurveyQuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateSurveyQuestionAnswerService" ADD CONSTRAINT "IntermediateSurveyQuestionAnswerService_surveyQuestionAnsw_fkey" FOREIGN KEY ("surveyQuestionAnswerServiceFeedbackId") REFERENCES "SurveyQuestionAnswerServiceFeedback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateSurveyQuestionAnswerService" ADD CONSTRAINT "IntermediateSurveyQuestionAnswerService_surveyQuestionOpti_fkey" FOREIGN KEY ("surveyQuestionOptionId") REFERENCES "SurveyQuestionOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswerProductFeedback" ADD CONSTRAINT "SurveyQuestionAnswerProductFeedback_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "SurveyQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswerProductFeedback" ADD CONSTRAINT "SurveyQuestionAnswerProductFeedback_answerSingleOptionId_fkey" FOREIGN KEY ("answerSingleOptionId") REFERENCES "SurveyQuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateSurveyQuestionAnswerProduct" ADD CONSTRAINT "IntermediateSurveyQuestionAnswerProduct_surveyQuestionAnsw_fkey" FOREIGN KEY ("surveyQuestionAnswerProductFeedbackId") REFERENCES "SurveyQuestionAnswerProductFeedback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateSurveyQuestionAnswerProduct" ADD CONSTRAINT "IntermediateSurveyQuestionAnswerProduct_surveyQuestionOpti_fkey" FOREIGN KEY ("surveyQuestionOptionId") REFERENCES "SurveyQuestionOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProductDistance" ADD CONSTRAINT "CustomerProductDistance_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProductDistance" ADD CONSTRAINT "CustomerProductDistance_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerBoxItems" ADD CONSTRAINT "CustomerBoxItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerBoxItems" ADD CONSTRAINT "CustomerBoxItems_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueuedShopifyOrder" ADD CONSTRAINT "QueuedShopifyOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
