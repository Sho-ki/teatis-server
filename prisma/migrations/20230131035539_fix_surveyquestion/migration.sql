/*
  Warnings:

  - You are about to drop the column `instruction` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `mustBeAnswered` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `questionCategoryId` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `surveyQuestionAnswerTypeId` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the `QuestionCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyQuestionAnswerType` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "answerType" AS ENUM ('number', 'text', 'single', 'multiple');

-- DropForeignKey
ALTER TABLE "SurveyQuestion" DROP CONSTRAINT "SurveyQuestion_questionCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestion" DROP CONSTRAINT "SurveyQuestion_surveyQuestionAnswerTypeId_fkey";

-- DropIndex
DROP INDEX "SurveyQuestion_name_key";

-- AlterTable
ALTER TABLE "SurveyQuestion" DROP COLUMN "instruction",
DROP COLUMN "mustBeAnswered",
DROP COLUMN "questionCategoryId",
DROP COLUMN "surveyQuestionAnswerTypeId",
ADD COLUMN     "answerType" "answerType" NOT NULL DEFAULT 'number',
ADD COLUMN     "hint" TEXT,
ADD COLUMN     "parentSurveyQuestionId" INTEGER,
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "name" DROP NOT NULL;

-- DropTable
DROP TABLE "QuestionCategory";

-- DropTable
DROP TABLE "SurveyQuestionAnswerType";

-- AddForeignKey
ALTER TABLE "SurveyQuestion" ADD CONSTRAINT "SurveyQuestion_parentSurveyQuestionId_fkey" FOREIGN KEY ("parentSurveyQuestionId") REFERENCES "SurveyQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
