/*
  Warnings:

  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerMedicalCondition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerMedicalConditionItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerNutrition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerNutritionItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomerMedicalCondition" DROP CONSTRAINT "CustomerMedicalCondition_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "CustomerMedicalCondition" DROP CONSTRAINT "CustomerMedicalCondition_customer_medical_condition_item_i_fkey";

-- DropForeignKey
ALTER TABLE "CustomerNutrition" DROP CONSTRAINT "CustomerNutrition_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "CustomerNutrition" DROP CONSTRAINT "CustomerNutrition_customer_nutrition_item_id_fkey";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "CustomerMedicalCondition";

-- DropTable
DROP TABLE "CustomerMedicalConditionItem";

-- DropTable
DROP TABLE "CustomerNutrition";

-- DropTable
DROP TABLE "CustomerNutritionItem";
