/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Practitioner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Practitioner" DROP COLUMN "phoneNumber",
ADD COLUMN     "profileImage" TEXT;
