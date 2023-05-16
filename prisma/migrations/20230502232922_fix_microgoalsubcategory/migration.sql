/*
  Warnings:

  - You are about to drop the `Subcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MicroGoal" DROP CONSTRAINT "MicroGoal_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_categoryId_fkey";

-- DropTable
DROP TABLE "Subcategory";

-- CreateTable
CREATE TABLE "MicroGoalSubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "MicroGoalSubCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MicroGoalSubCategory" ADD CONSTRAINT "MicroGoalSubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MicroGoalCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MicroGoal" ADD CONSTRAINT "MicroGoal_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "MicroGoalSubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
