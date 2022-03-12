/*
  Warnings:

  - You are about to alter the column `sweet` on the `ProductNutritionFact` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `sour` on the `ProductNutritionFact` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `salty` on the `ProductNutritionFact` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `bitter` on the `ProductNutritionFact` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `spicy` on the `ProductNutritionFact` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - The `texture` column on the `ProductNutritionFact` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ProductNutritionFact" ALTER COLUMN "sweet" SET DATA TYPE INTEGER,
ALTER COLUMN "sour" SET DATA TYPE INTEGER,
ALTER COLUMN "salty" SET DATA TYPE INTEGER,
ALTER COLUMN "bitter" SET DATA TYPE INTEGER,
ALTER COLUMN "spicy" SET DATA TYPE INTEGER,
DROP COLUMN "texture",
ADD COLUMN     "texture" TEXT;

-- DropEnum
DROP TYPE "Texure";
