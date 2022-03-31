/*
  Warnings:

  - You are about to drop the column `uuid` on the `SurveyQuestionAnswer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[responseId]` on the table `SurveyQuestionAnswer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SurveyQuestionAnswer_uuid_key";

-- AlterTable
ALTER TABLE "SurveyQuestionAnswer" DROP COLUMN "uuid",
ADD COLUMN     "responseId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestionAnswer_responseId_key" ON "SurveyQuestionAnswer"("responseId");
