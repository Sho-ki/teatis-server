/*
  Warnings:

  - You are about to drop the column `name` on the `MicroGoal` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "MicroGoal_name_key";

-- AlterTable
ALTER TABLE "MicroGoal" DROP COLUMN "name";
