-- CreateTable
CREATE TABLE "CustomerSurveyHistory" (
    "id" SERIAL NOT NULL,
    "orderNumber" TEXT,
    "surveyId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerSurveyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSurveyHistoryProduct" (
    "customerSurveyHistoryId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerSurveyHistoryProduct_pkey" PRIMARY KEY ("customerSurveyHistoryId","productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSurveyHistory_surveyId_customerId_key" ON "CustomerSurveyHistory"("surveyId", "customerId");

-- AddForeignKey
ALTER TABLE "CustomerSurveyHistory" ADD CONSTRAINT "CustomerSurveyHistory_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSurveyHistory" ADD CONSTRAINT "CustomerSurveyHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSurveyHistoryProduct" ADD CONSTRAINT "CustomerSurveyHistoryProduct_customerSurveyHistoryId_fkey" FOREIGN KEY ("customerSurveyHistoryId") REFERENCES "CustomerSurveyHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSurveyHistoryProduct" ADD CONSTRAINT "CustomerSurveyHistoryProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
