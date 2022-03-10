/*
  Warnings:

  - A unique constraint covering the columns `[name,surveyQuestionId]` on the table `SurveyQuestionOption` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `SurveyQuestionOption` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SurveyQuestionOption_label_surveyQuestionId_key";

-- AlterTable
ALTER TABLE "SurveyQuestionOption" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionOption_name_surveyQuestionId_key" ON "SurveyQuestionOption"("name", "surveyQuestionId");
