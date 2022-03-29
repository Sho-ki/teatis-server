/*
  Warnings:

  - The primary key for the `IntermediateSurveyQuestionAnswerProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `surveyQuestionAnswerProductFeedbackId` on the `IntermediateSurveyQuestionAnswerProduct` table. All the data in the column will be lost.
  - You are about to drop the `IntermediateSurveyQuestionAnswerService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyQuestionAnswerProductFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyQuestionAnswerServiceFeedback` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `surveyQuestionAnswerId` to the `IntermediateSurveyQuestionAnswerProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IntermediateSurveyQuestionAnswerProduct" DROP CONSTRAINT "IntermediateSurveyQuestionAnswerProduct_surveyQuestionAnsw_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateSurveyQuestionAnswerService" DROP CONSTRAINT "IntermediateSurveyQuestionAnswerService_surveyQuestionAnsw_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateSurveyQuestionAnswerService" DROP CONSTRAINT "IntermediateSurveyQuestionAnswerService_surveyQuestionOpti_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestionAnswerProductFeedback" DROP CONSTRAINT "SurveyQuestionAnswerProductFeedback_answerSingleOptionId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestionAnswerProductFeedback" DROP CONSTRAINT "SurveyQuestionAnswerProductFeedback_customerId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestionAnswerProductFeedback" DROP CONSTRAINT "SurveyQuestionAnswerProductFeedback_productId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestionAnswerProductFeedback" DROP CONSTRAINT "SurveyQuestionAnswerProductFeedback_surveyQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" DROP CONSTRAINT "SurveyQuestionAnswerServiceFeedback_answerSingleOptionId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" DROP CONSTRAINT "SurveyQuestionAnswerServiceFeedback_customerId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" DROP CONSTRAINT "SurveyQuestionAnswerServiceFeedback_surveyQuestionId_fkey";

-- AlterTable
ALTER TABLE "IntermediateSurveyQuestionAnswerProduct" DROP CONSTRAINT "IntermediateSurveyQuestionAnswerProduct_pkey",
DROP COLUMN "surveyQuestionAnswerProductFeedbackId",
ADD COLUMN     "surveyQuestionAnswerId" INTEGER NOT NULL,
ADD CONSTRAINT "IntermediateSurveyQuestionAnswerProduct_pkey" PRIMARY KEY ("surveyQuestionAnswerId", "surveyQuestionOptionId");

-- DropTable
DROP TABLE "IntermediateSurveyQuestionAnswerService";

-- DropTable
DROP TABLE "SurveyQuestionAnswerProductFeedback";

-- DropTable
DROP TABLE "SurveyQuestionAnswerServiceFeedback";

-- CreateTable
CREATE TABLE "SurveyQuestionAnswer" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT,
    "customerId" INTEGER NOT NULL,
    "surveyQuestionId" INTEGER NOT NULL,
    "answerSingleOptionId" INTEGER,
    "answerNumeric" INTEGER,
    "answerText" TEXT,
    "answerBool" BOOLEAN,
    "reason" TEXT,
    "title" TEXT,
    "content" TEXT,
    "answerCount" INTEGER,
    "productId" INTEGER NOT NULL,
    "orderNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyQuestionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionAnswer_uuid_key" ON "SurveyQuestionAnswer"("uuid");

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswer" ADD CONSTRAINT "SurveyQuestionAnswer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswer" ADD CONSTRAINT "SurveyQuestionAnswer_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "SurveyQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswer" ADD CONSTRAINT "SurveyQuestionAnswer_answerSingleOptionId_fkey" FOREIGN KEY ("answerSingleOptionId") REFERENCES "SurveyQuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswer" ADD CONSTRAINT "SurveyQuestionAnswer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateSurveyQuestionAnswerProduct" ADD CONSTRAINT "IntermediateSurveyQuestionAnswerProduct_surveyQuestionAnsw_fkey" FOREIGN KEY ("surveyQuestionAnswerId") REFERENCES "SurveyQuestionAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
