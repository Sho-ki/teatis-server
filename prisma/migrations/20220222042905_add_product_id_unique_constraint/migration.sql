/*
  Warnings:

  - A unique constraint covering the columns `[surveyQuestionId,shopifyOrderNumber,productId]` on the table `SurveyQuestionAnswerProductFeedback` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SurveyQuestionAnswerProductFeedback_surveyQuestionId_shopif_key";

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionAnswerProductFeedback_surveyQuestionId_shopif_key" ON "SurveyQuestionAnswerProductFeedback"("surveyQuestionId", "shopifyOrderNumber", "productId");
