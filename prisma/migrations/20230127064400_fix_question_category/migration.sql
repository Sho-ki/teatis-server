/*
  Warnings:

  - Made the column `displayOrder` on table `IntermediateSurveyQuestion` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SurveyQuestion" DROP CONSTRAINT "SurveyQuestion_questionCategoryId_fkey";

-- AlterTable
ALTER TABLE "IntermediateSurveyQuestion" ADD COLUMN     "activeStatus" "ActiveStatus" NOT NULL DEFAULT 'active',
ALTER COLUMN "displayOrder" SET NOT NULL;

-- AlterTable
ALTER TABLE "SurveyQuestion" ALTER COLUMN "questionCategoryId" DROP NOT NULL,
ALTER COLUMN "activeStatus" DROP NOT NULL,
ALTER COLUMN "activeStatus" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "SurveyQuestion" ADD CONSTRAINT "SurveyQuestion_questionCategoryId_fkey" FOREIGN KEY ("questionCategoryId") REFERENCES "QuestionCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
