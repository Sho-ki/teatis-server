/*
  Warnings:

  - You are about to drop the column `uuid` on the `OneTimeCode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pointToken]` on the table `OneTimeCode` will be added. If there are existing duplicate values, this will fail.
  - The required column `pointToken` was added to the `OneTimeCode` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "OneTimeCode_uuid_key";

-- AlterTable
ALTER TABLE "OneTimeCode" DROP COLUMN "uuid",
ADD COLUMN     "pointToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OneTimeCode_pointToken_key" ON "OneTimeCode"("pointToken");
