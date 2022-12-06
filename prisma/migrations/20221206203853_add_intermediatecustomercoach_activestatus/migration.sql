/*
  Warnings:

  - Added the required column `activeStatus` to the `IntermediateCustomerCoach` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IntermediateCustomerCoach" ADD COLUMN     "activeStatus" "ActiveStatus" NOT NULL;
