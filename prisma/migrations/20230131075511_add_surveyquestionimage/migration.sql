/*
  Warnings:

  - You are about to drop the column `answerType` on the `SurveyQuestion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `SurveyQuestion` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `SurveyQuestion` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('number', 'text', 'single', 'multiple', 'noResponse');

-- AlterTable
ALTER TABLE "SurveyQuestion" DROP COLUMN "answerType",
ADD COLUMN     "responseType" "ResponseType" NOT NULL DEFAULT 'number',
ALTER COLUMN "name" SET NOT NULL;

-- DropEnum
DROP TYPE "AnswerType";

-- CreateTable
CREATE TABLE "SurveyQuestionImage" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "position" INTEGER,
    "surveyQuestionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyQuestionImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestion_name_key" ON "SurveyQuestion"("name");

-- AddForeignKey
ALTER TABLE "SurveyQuestionImage" ADD CONSTRAINT "SurveyQuestionImage_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "SurveyQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
