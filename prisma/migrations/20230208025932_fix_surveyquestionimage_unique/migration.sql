/*
  Warnings:

  - A unique constraint covering the columns `[src]` on the table `SurveyQuestionImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionImage_src_key" ON "SurveyQuestionImage"("src");
