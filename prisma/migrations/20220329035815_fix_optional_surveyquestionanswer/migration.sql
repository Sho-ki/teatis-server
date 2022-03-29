-- DropForeignKey
ALTER TABLE "SurveyQuestionAnswer" DROP CONSTRAINT "SurveyQuestionAnswer_productId_fkey";

-- AlterTable
ALTER TABLE "SurveyQuestionAnswer" ALTER COLUMN "productId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SurveyQuestionAnswer" ADD CONSTRAINT "SurveyQuestionAnswer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
