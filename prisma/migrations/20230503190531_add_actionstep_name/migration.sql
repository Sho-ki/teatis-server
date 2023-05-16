/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ActionStep` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ActionStep` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ActionStep_mainText_key";

-- AlterTable
ALTER TABLE "ActionStep" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ActionStep_name_key" ON "ActionStep"("name");
