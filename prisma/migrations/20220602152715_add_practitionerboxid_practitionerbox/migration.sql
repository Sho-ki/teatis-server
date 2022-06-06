/*
  Warnings:

  - A unique constraint covering the columns `[practitionerBoxUuid]` on the table `PractitionerBox` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `practitionerBoxUuid` to the `PractitionerBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PractitionerBox" ADD COLUMN     "practitionerBoxUuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PractitionerBox_practitionerBoxUuid_key" ON "PractitionerBox"("practitionerBoxUuid");
