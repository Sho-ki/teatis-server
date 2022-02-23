/*
  Warnings:

  - You are about to drop the column `name` on the `SurveyQuestionAnswerType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[label]` on the table `SurveyQuestionAnswerType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `SurveyQuestionAnswerType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SurveyQuestionAnswerType" DROP COLUMN "name",
ADD COLUMN     "label" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionAnswerType_label_key" ON "SurveyQuestionAnswerType"("label");
