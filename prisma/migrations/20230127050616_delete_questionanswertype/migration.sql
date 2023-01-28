/*
  Warnings:

  - You are about to drop the `IntermediateSurveyQuestionAnswerProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IntermediateSurveyQuestionAnswerProduct" DROP CONSTRAINT "IntermediateSurveyQuestionAnswerProduct_surveyQuestionAnsw_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateSurveyQuestionAnswerProduct" DROP CONSTRAINT "IntermediateSurveyQuestionAnswerProduct_surveyQuestionOpti_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestion" DROP CONSTRAINT "SurveyQuestion_surveyQuestionAnswerTypeId_fkey";

-- AlterTable
ALTER TABLE "SurveyQuestion" ALTER COLUMN "surveyQuestionAnswerTypeId" DROP NOT NULL;

-- DropTable
DROP TABLE "IntermediateSurveyQuestionAnswerProduct";

-- AddForeignKey
ALTER TABLE "SurveyQuestion" ADD CONSTRAINT "SurveyQuestion_surveyQuestionAnswerTypeId_fkey" FOREIGN KEY ("surveyQuestionAnswerTypeId") REFERENCES "SurveyQuestionAnswerType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
