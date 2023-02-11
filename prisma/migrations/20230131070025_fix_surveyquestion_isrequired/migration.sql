/*
  Warnings:

  - You are about to drop the column `required` on the `SurveyQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SurveyQuestion" DROP COLUMN "required",
ADD COLUMN     "isRequired" BOOLEAN NOT NULL DEFAULT false;
