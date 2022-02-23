/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `QuestionCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `QuestionCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionCategory" ADD COLUMN     "label" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QuestionCategory_label_key" ON "QuestionCategory"("label");
