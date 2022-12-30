/*
  Warnings:

  - Made the column `sequenceBasedAutoMessageInterval` on table `Customers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Customers" ALTER COLUMN "sequenceBasedAutoMessageInterval" SET NOT NULL;
