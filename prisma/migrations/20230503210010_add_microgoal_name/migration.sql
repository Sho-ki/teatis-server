/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MicroGoal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `MicroGoalCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `MicroGoalSubCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `MicroGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MicroGoalCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MicroGoalSubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MicroGoal" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MicroGoalCategory" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MicroGoalSubCategory" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MicroGoal_name_key" ON "MicroGoal"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MicroGoalCategory_name_key" ON "MicroGoalCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MicroGoalSubCategory_name_key" ON "MicroGoalSubCategory"("name");
