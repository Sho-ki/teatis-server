/*
  Warnings:

  - The `answerType` column on the `SurveyQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `name` on the `SurveyQuestionOption` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SurveyQuestionOption` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[label,surveyQuestionId]` on the table `SurveyQuestionOption` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('number', 'text', 'single', 'multiple');

-- DropIndex
DROP INDEX "SurveyQuestionOption_name_surveyQuestionId_key";

-- AlterTable
ALTER TABLE "SurveyQuestion" DROP COLUMN "answerType",
ADD COLUMN     "answerType" "AnswerType" NOT NULL DEFAULT 'number';

-- AlterTable
ALTER TABLE "SurveyQuestionOption" DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "answerType";

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionOption_label_surveyQuestionId_key" ON "SurveyQuestionOption"("label", "surveyQuestionId");
