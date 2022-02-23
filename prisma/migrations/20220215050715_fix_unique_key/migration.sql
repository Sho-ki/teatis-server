/*
  Warnings:

  - You are about to drop the column `label` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `shopifyOrderId` on the `SurveyQuestionAnswerProductFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `shopifyOrderId` on the `SurveyQuestionAnswerServiceFeedback` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[surveyQuestionId,shopifyOrderNumber]` on the table `SurveyQuestionAnswerProductFeedback` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[surveyQuestionId,shopifyOrderNumber]` on the table `SurveyQuestionAnswerServiceFeedback` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shopifyOrderNumber` to the `SurveyQuestionAnswerProductFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopifyOrderNumber` to the `SurveyQuestionAnswerServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SurveyQuestionAnswerProductFeedback_customerId_surveyQuesti_key";

-- DropIndex
DROP INDEX "SurveyQuestionAnswerServiceFeedback_customerId_surveyQuesti_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "label",
ALTER COLUMN "externalId" SET DATA TYPE TEXT,
ALTER COLUMN "upcCode" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ProductNutritionFact" ALTER COLUMN "totalFatG" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "saturatedFatG" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "transFatG" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cholesteroleMg" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "sodiumMg" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalCarbohydrateG" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "dietaryFiberG" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalSugarG" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "addedSugarG" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "proteinG" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "sweet" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "sour" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "salty" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "bitter" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "spicy" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "SurveyQuestionAnswerProductFeedback" DROP COLUMN "shopifyOrderId",
ADD COLUMN     "shopifyOrderNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" DROP COLUMN "shopifyOrderId",
ADD COLUMN     "shopifyOrderNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionAnswerProductFeedback_surveyQuestionId_shopif_key" ON "SurveyQuestionAnswerProductFeedback"("surveyQuestionId", "shopifyOrderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionAnswerServiceFeedback_surveyQuestionId_shopif_key" ON "SurveyQuestionAnswerServiceFeedback"("surveyQuestionId", "shopifyOrderNumber");
