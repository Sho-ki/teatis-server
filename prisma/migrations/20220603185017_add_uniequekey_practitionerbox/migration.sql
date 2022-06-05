/*
  Warnings:

  - A unique constraint covering the columns `[practitionerId,label]` on the table `PractitionerBox` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PractitionerBox_practitionerId_label_key" ON "PractitionerBox"("practitionerId", "label");
