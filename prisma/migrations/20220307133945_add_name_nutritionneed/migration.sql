/*
  Warnings:

  - You are about to drop the column `description` on the `CustomerNutritionNeed` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `CustomerNutritionNeed` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `CustomerNutritionNeed` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CustomerNutritionNeed_label_key";

-- AlterTable
ALTER TABLE "CustomerNutritionNeed" DROP COLUMN "description",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CustomerNutritionNeed_name_key" ON "CustomerNutritionNeed"("name");
