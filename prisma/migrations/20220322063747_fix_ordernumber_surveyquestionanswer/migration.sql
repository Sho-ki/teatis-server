/*
  Warnings:

  - You are about to drop the column `shopifyOrderNumber` on the `SurveyQuestionAnswerProductFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `shopifyOrderNumber` on the `SurveyQuestionAnswerServiceFeedback` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[surveyQuestionId,orderNumber,productId]` on the table `SurveyQuestionAnswerProductFeedback` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[surveyQuestionId,orderNumber]` on the table `SurveyQuestionAnswerServiceFeedback` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SurveyQuestionAnswerProductFeedback_surveyQuestionId_shopif_key";

-- DropIndex
DROP INDEX "SurveyQuestionAnswerServiceFeedback_surveyQuestionId_shopif_key";

-- AlterTable
ALTER TABLE "SurveyQuestionAnswerProductFeedback" DROP COLUMN "shopifyOrderNumber",
ADD COLUMN     "orderNumber" TEXT;

-- AlterTable
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" DROP COLUMN "shopifyOrderNumber",
ADD COLUMN     "orderNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionAnswerProductFeedback_surveyQuestionId_orderN_key" ON "SurveyQuestionAnswerProductFeedback"("surveyQuestionId", "orderNumber", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionAnswerServiceFeedback_surveyQuestionId_orderN_key" ON "SurveyQuestionAnswerServiceFeedback"("surveyQuestionId", "orderNumber");
