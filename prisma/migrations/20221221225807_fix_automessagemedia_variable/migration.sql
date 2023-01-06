/*
  Warnings:

  - The `variable` column on the `AutoMessageMedia` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VariableType" AS ENUM ('customerUuid');

-- AlterTable
ALTER TABLE "AutoMessageMedia" DROP COLUMN "variable",
ADD COLUMN     "variable" "VariableType";
