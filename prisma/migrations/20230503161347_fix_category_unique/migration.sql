/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MicroGoalCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `MicroGoalSubCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MicroGoalCategory_name_key" ON "MicroGoalCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MicroGoalSubCategory_name_key" ON "MicroGoalSubCategory"("name");
