/*
  Warnings:

  - You are about to drop the column `instruction` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `questionCategoryId` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `surveyQuestionAnswerTypeId` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `answerSingleOptionId` on the `SurveyQuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `SurveyQuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `SurveyQuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the `QuestionCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyQuestionAnswerType` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('multiple', 'single', 'numeric', 'text', 'infomation');

-- DropForeignKey
ALTER TABLE "SurveyQuestion" DROP CONSTRAINT "SurveyQuestion_questionCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestion" DROP CONSTRAINT "SurveyQuestion_surveyQuestionAnswerTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyQuestionAnswer" DROP CONSTRAINT "SurveyQuestionAnswer_answerSingleOptionId_fkey";

-- AlterTable
ALTER TABLE "SurveyQuestion" DROP COLUMN "instruction",
DROP COLUMN "questionCategoryId",
DROP COLUMN "surveyQuestionAnswerTypeId",
ADD COLUMN     "hint" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" "QuestionType" NOT NULL DEFAULT 'single';

-- AlterTable
ALTER TABLE "SurveyQuestionAnswer" DROP COLUMN "answerSingleOptionId",
DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "answerOptionId" INTEGER;

-- DropTable
DROP TABLE "QuestionCategory";

-- DropTable
DROP TABLE "SurveyQuestionAnswerType";

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswer" ADD CONSTRAINT "SurveyQuestionAnswer_answerOptionId_fkey" FOREIGN KEY ("answerOptionId") REFERENCES "SurveyQuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
