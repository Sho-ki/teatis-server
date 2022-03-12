/*
  Warnings:

  - Added the required column `label` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `SurveyQuestionAnswerType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "label" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SurveyQuestionAnswerType" ADD COLUMN     "label" TEXT NOT NULL;
