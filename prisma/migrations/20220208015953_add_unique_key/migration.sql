/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `ProductAllergen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `ProductFlavor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `ProductIngredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Survey` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `SurveyQuestion` will be added. If there are existing duplicate values, this will fail.
  - Made the column `label` on table `CustomerMedicalCondition` required. This step will fail if there are existing NULL values in that column.
  - Made the column `label` on table `CustomerNutritionNeed` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CustomerMedicalCondition" ALTER COLUMN "label" SET NOT NULL;

-- AlterTable
ALTER TABLE "CustomerNutritionNeed" ALTER COLUMN "label" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductAllergen_label_key" ON "ProductAllergen"("label");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_label_key" ON "ProductCategory"("label");

-- CreateIndex
CREATE UNIQUE INDEX "ProductFlavor_label_key" ON "ProductFlavor"("label");

-- CreateIndex
CREATE UNIQUE INDEX "ProductIngredient_label_key" ON "ProductIngredient"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Survey_name_key" ON "Survey"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestion_label_key" ON "SurveyQuestion"("label");
