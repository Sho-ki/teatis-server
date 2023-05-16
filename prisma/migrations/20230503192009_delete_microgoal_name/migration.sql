/*
  Warnings:

  - You are about to drop the column `name` on the `ActionStep` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `MicroGoal` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `MicroGoalCategory` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `MicroGoalSubCategory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ActionStep_name_key";

-- DropIndex
DROP INDEX "MicroGoal_name_key";

-- DropIndex
DROP INDEX "MicroGoalCategory_name_key";

-- DropIndex
DROP INDEX "MicroGoalSubCategory_name_key";

-- AlterTable
ALTER TABLE "ActionStep" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "MicroGoal" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "MicroGoalCategory" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "MicroGoalSubCategory" DROP COLUMN "name";
