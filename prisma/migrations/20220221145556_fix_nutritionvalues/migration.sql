/*
  Warnings:

  - You are about to drop the column `nutritionValue` on the `IntermediateCustomerProductFoodType` table. All the data in the column will be lost.
  - You are about to drop the column `nutritionValue` on the `IntermediateProductFoodType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IntermediateCustomerProductFoodType" DROP COLUMN "nutritionValue";

-- AlterTable
ALTER TABLE "IntermediateProductFoodType" DROP COLUMN "nutritionValue";

-- AlterTable
ALTER TABLE "SurveyQuestionAnswerProductFeedback" ALTER COLUMN "answerCount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SurveyQuestionAnswerServiceFeedback" ALTER COLUMN "answerCount" DROP NOT NULL;
