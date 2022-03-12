/*
  Warnings:

  - You are about to drop the column `height` on the `Customers` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customers" DROP COLUMN "height",
DROP COLUMN "weight",
ADD COLUMN     "heightCm" DOUBLE PRECISION,
ADD COLUMN     "weightKg" DOUBLE PRECISION;
