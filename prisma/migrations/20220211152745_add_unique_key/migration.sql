/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `SurveyQuestion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SurveyQuestion_label_key";

-- CreateIndex
CREATE UNIQUE INDEX "SurveyQuestion_name_key" ON "SurveyQuestion"("name");
