-- CreateEnum
CREATE TYPE "BoxPlan" AS ENUM ('mini', 'standard', 'max');

-- CreateTable
CREATE TABLE "MonthlyBoxSelection" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "boxPlan" "BoxPlan" NOT NULL,
    "description" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyBoxSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediateMonthlyBoxSelectionProduct" (
    "monthlyBoxSelectionId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateMonthlyBoxSelectionProduct_pkey" PRIMARY KEY ("monthlyBoxSelectionId","productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyBoxSelection_label_boxPlan_key" ON "MonthlyBoxSelection"("label", "boxPlan");

-- AddForeignKey
ALTER TABLE "IntermediateMonthlyBoxSelectionProduct" ADD CONSTRAINT "IntermediateMonthlyBoxSelectionProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateMonthlyBoxSelectionProduct" ADD CONSTRAINT "IntermediateMonthlyBoxSelectionProduct_monthlyBoxSelection_fkey" FOREIGN KEY ("monthlyBoxSelectionId") REFERENCES "MonthlyBoxSelection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
