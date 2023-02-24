/*
  Warnings:

  - You are about to drop the `CustomerProductDistance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomerProductDistance" DROP CONSTRAINT "CustomerProductDistance_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerProductDistance" DROP CONSTRAINT "CustomerProductDistance_productId_fkey";

-- DropTable
DROP TABLE "CustomerProductDistance";
