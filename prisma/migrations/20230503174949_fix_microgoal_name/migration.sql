/*
  Warnings:

  - You are about to drop the column `description` on the `MicroGoal` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `MicroGoal` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `MicroGoal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `MicroGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MicroGoal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MicroGoal" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MicroGoal_name_key" ON "MicroGoal"("name");
