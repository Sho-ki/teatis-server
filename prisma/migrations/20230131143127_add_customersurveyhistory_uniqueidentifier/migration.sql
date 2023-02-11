/*
  Warnings:

  - A unique constraint covering the columns `[surveyId,customerId,orderNumber]` on the table `CustomerSurveyHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CustomerSurveyHistory_surveyId_customerId_orderNumber_key" ON "CustomerSurveyHistory"("surveyId", "customerId", "orderNumber");
