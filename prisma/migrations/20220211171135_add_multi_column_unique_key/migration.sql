/*
  Warnings:

  - A unique constraint covering the columns `[label,surveyQuestionId]` on the table `SurveyQuestionOption` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionOption_label_surveyQuestionId_key" ON "SurveyQuestionOption"("label", "surveyQuestionId");
