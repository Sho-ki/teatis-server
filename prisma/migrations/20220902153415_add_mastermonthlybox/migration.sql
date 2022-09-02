/*
  Warnings:

  - Made the column `label` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "IntermediatePractitionerBoxProduct" DROP CONSTRAINT "IntermediatePractitionerBoxProduct_practitionerBoxId_fkey";

-- AlterTable
ALTER TABLE "PractitionerBox" ADD COLUMN     "masterMonthlyBoxId" INTEGER;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "label" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "MasterMonthlyBox" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasterMonthlyBox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediateMasterMonthlyBoxProduct" (
    "masterMonthlyBoxId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntermediateMasterMonthlyBoxProduct_pkey" PRIMARY KEY ("masterMonthlyBoxId","productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "MasterMonthlyBox_label_key" ON "MasterMonthlyBox"("label");

-- AddForeignKey
ALTER TABLE "PractitionerBox" ADD CONSTRAINT "PractitionerBox_masterMonthlyBoxId_fkey" FOREIGN KEY ("masterMonthlyBoxId") REFERENCES "MasterMonthlyBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediatePractitionerBoxProduct" ADD CONSTRAINT "IntermediatePractitionerBoxProduct_practitionerBoxId_fkey" FOREIGN KEY ("practitionerBoxId") REFERENCES "PractitionerBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateMasterMonthlyBoxProduct" ADD CONSTRAINT "IntermediateMasterMonthlyBoxProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediateMasterMonthlyBoxProduct" ADD CONSTRAINT "IntermediateMasterMonthlyBoxProduct_masterMonthlyBoxId_fkey" FOREIGN KEY ("masterMonthlyBoxId") REFERENCES "MasterMonthlyBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
