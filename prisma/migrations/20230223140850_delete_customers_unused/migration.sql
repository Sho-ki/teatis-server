/*
  Warnings:

  - You are about to drop the column `activeLevel` on the `Customers` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Customers` table. All the data in the column will be lost.
  - You are about to drop the column `frozenAvailable` on the `Customers` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Customers` table. All the data in the column will be lost.
  - You are about to drop the column `heightCm` on the `Customers` table. All the data in the column will be lost.
  - You are about to drop the column `weightKg` on the `Customers` table. All the data in the column will be lost.
  - Made the column `uuid` on table `Customers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Customers" DROP COLUMN "activeLevel",
DROP COLUMN "age",
DROP COLUMN "frozenAvailable",
DROP COLUMN "gender",
DROP COLUMN "heightCm",
DROP COLUMN "weightKg",
ALTER COLUMN "uuid" SET NOT NULL;
