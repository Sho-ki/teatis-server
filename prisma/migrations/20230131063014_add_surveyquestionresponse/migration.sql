/*
  Warnings:

  - You are about to drop the column `activeStatus` on the `IntermediateSurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `activeStatus` on the `SurveyQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IntermediateSurveyQuestion" DROP COLUMN "activeStatus",
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SurveyQuestion" DROP COLUMN "activeStatus";

-- CreateTable
CREATE TABLE "SurveyQuestionResponse" (
    "id" SERIAL NOT NULL,
    "surveyQuestionId" INTEGER NOT NULL,
    "customerSurveyHistoryId" INTEGER NOT NULL,
    "response" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyQuestionResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SurveyQuestionResponse" ADD CONSTRAINT "SurveyQuestionResponse_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "SurveyQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestionResponse" ADD CONSTRAINT "SurveyQuestionResponse_customerSurveyHistoryId_fkey" FOREIGN KEY ("customerSurveyHistoryId") REFERENCES "CustomerSurveyHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
