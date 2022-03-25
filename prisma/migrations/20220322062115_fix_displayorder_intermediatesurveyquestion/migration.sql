/*
  Warnings:

  - You are about to drop the column `order` on the `IntermediateSurveyQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IntermediateSurveyQuestion" DROP COLUMN "order",
ADD COLUMN     "displayOrder" INTEGER;
