/*
  Warnings:

  - A unique constraint covering the columns `[mainText]` on the table `ActionStep` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ActionStep" ALTER COLUMN "subText" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ActionStep_mainText_key" ON "ActionStep"("mainText");
