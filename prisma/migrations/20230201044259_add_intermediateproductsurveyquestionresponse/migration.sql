/*
  Warnings:

  - You are about to drop the `CustomerSurveyHistoryProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomerSurveyHistoryProduct" DROP CONSTRAINT "CustomerSurveyHistoryProduct_customerSurveyHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerSurveyHistoryProduct" DROP CONSTRAINT "CustomerSurveyHistoryProduct_productId_fkey";

-- DropTable
DROP TABLE "CustomerSurveyHistoryProduct";

-- CreateTable
CREATE TABLE "IntermediateProductSurveyQuestionResponse" (
    "surveyQuestionResponseId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateProductSurveyQuestionResponse_pkey" PRIMARY KEY ("surveyQuestionResponseId","productId")
);

-- AddForeignKey
ALTER TABLE "IntermediateProductSurveyQuestionResponse" ADD CONSTRAINT "IntermediateProductSurveyQuestionResponse_surveyQuestionRe_fkey" FOREIGN KEY ("surveyQuestionResponseId") REFERENCES "SurveyQuestionResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateProductSurveyQuestionResponse" ADD CONSTRAINT "IntermediateProductSurveyQuestionResponse_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
