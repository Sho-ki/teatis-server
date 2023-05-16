/*
  Warnings:

  - You are about to drop the column `categoryId` on the `MicroGoal` table. All the data in the column will be lost.
  - Added the required column `reason` to the `ActionStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryId` to the `MicroGoal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MicroGoal" DROP CONSTRAINT "MicroGoal_categoryId_fkey";

-- AlterTable
ALTER TABLE "ActionStep" ADD COLUMN     "reason" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MicroGoal" DROP COLUMN "categoryId",
ADD COLUMN     "subCategoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ActionStepImage" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "actionStepId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionStepImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerActionStepImage" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "customerActionStepId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerActionStepImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MicroGoal" ADD CONSTRAINT "MicroGoal_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionStepImage" ADD CONSTRAINT "ActionStepImage_actionStepId_fkey" FOREIGN KEY ("actionStepId") REFERENCES "ActionStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActionStepImage" ADD CONSTRAINT "CustomerActionStepImage_customerActionStepId_fkey" FOREIGN KEY ("customerActionStepId") REFERENCES "CustomerActionStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
